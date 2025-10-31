const db = require("../models");
const appointmentSchema = require("../utils/appointmentValidator");
const {
  resServerError,
  resFound,
  resErrorOccuredCustom,
  resDocCreated,
  resNotFound,
  resDocDeleted,
} = require("../utils/response");
const {
  isBefore,
  isAfter,
  parseISO,
  startOfDay,
  addMinutes,
  isEqual,
} = require("date-fns");

const BUSINESS_START_HOUR = 9; // 09:00 local time
const BUSINESS_END_HOUR = 17; // 17:00 local time
const SLOT_MINUTES = 30;


// Helper: check slot is within business hours (local-time assumption on client side)
// We will treat incoming startAt/endAt as ISO with timezone; check hours using local offset
function isWithinBusinessHours(startAt, endAt) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const startHour = start.getHours();
  const endHour = end.getHours();
  // start must be >= 9:00 and end <= 17:00, and minutes aligned to 0 or 30
  if (startHour < BUSINESS_START_HOUR) return false;
  if (endHour > BUSINESS_END_HOUR) return false;
  // also if start at 17:00 exactly with 0 minutes, end would be > 17 -> invalid
  const startMinutes = start.getMinutes();
  const endMinutes = end.getMinutes();
  // valid minutes 0 or 30; end should equal start + 30
  const validMinutes = (m) => m === 0 || m === 30;
  if (!validMinutes(startMinutes) || !validMinutes(endMinutes)) return false;
  return true;
}

const listAll = async (req, res) => {
  try {
    const all = await db.appointment.findAll({ order: [["startAt", "ASC"]] });
    return resFound(res, all);
  } catch (err) {
    return resServerError(res, err);
  }
};

async function listAvailable(req, res, next) {
  // Query params: weekStart (ISO date) optional; default current week (Monday) — frontend can compute
  try {
    // For simplicity, frontend will call this endpoint with a visible range: start and end ISO strings.
    const { rangeStart, rangeEnd } = req.query;
    if (!rangeStart || !rangeEnd) {
      return res.status(400).json({
        error: "Please provide rangeStart and rangeEnd as ISO strings",
      });
    }
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    const existing = await Appointment.findAll({
      where: {
        startAt: { $gte: start, $lt: end }, // Sequelize v6 uses Op, but we'll use Op below
      },
      order: [["startAt", "ASC"]],
    });
    // But to keep compatibility, use Op properly:
  } catch (err) {
    next(err);
  }
}

const { Op } = require("sequelize");

const getAvailableSlots = async (req, res) => {
  try {
    const { rangeStart, rangeEnd, tz } = req.query;
    if (!rangeStart || !rangeEnd) {
      return resErrorOccuredCustom(
        res,
        "400",
        "Please provide rangeStart and rangeEnd as ISO strings"
      );
    }
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);

    // Fetch existing appointments in the range
    const existing = await db.appointment.findAll({
      where: {
        startAt: { [Op.gte]: start, [Op.lt]: end },
      },
      order: [["startAt", "ASC"]],
    });

    // Build all possible slots between start and end between 9-17 Mon-Fri
    const slots = [];
    const cur = new Date(start);
    while (cur < end) {
      const day = cur.getDay(); // 0 Sun, 1 Mon...
      if (day >= 1 && day <= 5) {
        for (let hour = BUSINESS_START_HOUR; hour < BUSINESS_END_HOUR; hour++) {
          for (let minute of [0, 30]) {
            const slotStart = new Date(cur);
            slotStart.setHours(hour, minute, 0, 0);
            // if slotStart outside the range boundaries, skip
            if (slotStart < start || slotStart >= end) continue;
            const slotEnd = new Date(
              slotStart.getTime() + SLOT_MINUTES * 60000
            );

            // Check overlap with existing
            const overlapping = existing.some((appt) => {
              const aStart = new Date(appt.startAt);
              const aEnd = new Date(appt.endAt);
              return slotStart < aEnd && slotEnd > aStart;
            });

            slots.push({
              startAt: slotStart.toISOString(),
              endAt: slotEnd.toISOString(),
              available: !overlapping,
            });
          }
        }
      }
      // next day
      cur.setDate(cur.getDate() + 1);
      cur.setHours(0, 0, 0, 0);
    }
    return resFound(res, slots);
  } catch (err) {
    return resServerError(res, err);
  }
};

const createAppointment = async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    if (error) {
      let er = error.details.map((d) => d.message).join(", ");
      return resErrorOccuredCustom(res, er);
    }

    const { startAt, endAt, name, email, phone, reason } = value;
    const now = new Date();

    // No past bookings
    if (new Date(startAt) < now) {
      return resErrorOccuredCustom(res, "Cannot book for past time.");
    }

    // Business hours check
    if (!isWithinBusinessHours(startAt, endAt)) {
      return resErrorOccuredCustom(
        res,
        "Appointment must be inside business hours (9:00-17:00) and 30-min increments."
      );
    }

    // Check slot length
    const s = new Date(startAt);
    const e = new Date(endAt);
    const diff = (e - s) / 60000;
    if (diff !== SLOT_MINUTES) {
      return resErrorOccuredCustom(
        res,
        `Slot must be exactly ${SLOT_MINUTES} minutes.`
      );
    }

    // Prevent double booking by checking overlap
    const overlap = await db.appointment.findOne({
      where: {
        [Op.and]: [{ startAt: { [Op.lt]: e } }, { endAt: { [Op.gt]: s } }],
      },
    });

    if (overlap) {
      return resAlreadyPresent(res, "Time slot already booked.");
    }

    // Create appointment
    const appointment = await db.appointment.create({
      startAt: s.toISOString(),
      endAt: e.toISOString(),
      name,
      email,
      phone,
      reason,
    });

    return resDocCreated(res, appointment);
  } catch (err) {
    return resServerError(res, err);
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const Id = parseInt(req.params.id, 10);
    const appt = await db.appointment.findByPk(Id);
    if (!appt) return resNotFound(res, "Appointment not found.");

    await appt.destroy();
    return resDocDeleted(res, "Appointment cancelled.");
  } catch (err) {
    return resServerError(res, err);
  }
};

module.exports = {
  listAll,
  getAvailableSlots,
  createAppointment,
  deleteAppointment,
};
