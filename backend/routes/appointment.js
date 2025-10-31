const usersController = require("../controllers/users");
const routes = require("express").Router();

routes.get("/", ctrl.listAll);
routes.get("/available", ctrl.getAvailableSlots);
routes.post("/", ctrl.createAppointment);
routes.delete("/:id", ctrl.deleteAppointment);

module.exports = routes;