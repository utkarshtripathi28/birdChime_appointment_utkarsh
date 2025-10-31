let resNotFound = (res, errMsg) => {
  return res
    .status(203)
    .send({ statusCode: "203", statusMessage: "Not Found!!", error: errMsg });
};
let resServerError = (res, error) => {
  console.error(error);

  if (error?.errors) {
    if (error.errors[0].validatorKey === "not_unique") {
      let errMsg = String(error.errors[0].message);
      return res.status(203).send({
        statusCode: "203",
        statusMessage: errMsg.replace("_u1", ""),
        error: [],
      });
    } else {
      return res.status(500).send({
        statusCode: "500",
        statusMessage: "Server Error!!",
        error: error,
      });
    }
  } else if (error?.parent?.code === "ER_DATA_TOO_LONG") {
    return res
      .status(203)
      .send({ statusCode: "203", statusMessage: "Data too long.", error: [] });
  } else {
    return res.status(500).send({
      statusCode: "500",
      statusMessage: "Server Error!!",
      error: error,
    });
  }
};
let resDocCreated = (res, doc) => {
  return res.status(200).send({
    statusCode: "200",
    statusMessage: "Document created successfully",
    data: doc,
  });
};

let resDocCreatedCustom = (res, message, doc) => {
  return res
    .status(200)
    .send({ statusCode: "200", statusMessage: message, data: doc });
};
let resErrorOccuredCustom = (res, message, doc=null) => {
  return res
    .status(400)
    .send({ statusCode: "400", statusMessage: message, data: doc });
};
let resAlreadyPresent = (res, message) => {
  return res
    .status(409)
    .send({ statusCode: "409", statusMessage: message, data: null });
};

let resDocUpdated = (res, doc) => {
  return res.status(200).send({
    statusCode: "200",
    statusMessage: "Document updated successfully",
    data: doc,
  });
};
let resReqProcessed = (res, inMessage, doc) => {
  let msg =
    inMessage !== null && inMessage !== undefined && inMessage !== ""
      ? inMessage
      : "Request Processed Successfully";
  return res
    .status(200)
    .send({ statusCode: "200", statusMessage: msg, data: doc });
};
let resErrorOccured = (res, err) => {
  let er =
    err !== null && err !== undefined && err !== "" ? err : "Error Occured";
  return res
    .status(203)
    .send({ statusCode: "203", statusMessage: er, error: er });
};
let resAlreadyExists = (res, doc) => {
  return res.status(203).send({
    statusCode: "203",
    statusMessage: "Document already exists",
    data: doc,
  });
};
let resNotAuthorised = (res, err) => {
  let er =
    err !== null && err !== undefined && err !== "" ? err : "Error Occured";
  return res.status(203).send({
    statusCode: "401",
    statusMessage: er,
    data: er,
  });
};

let resFound = (res, doc) => {
  return res
    .status(200)
    .send({ statusCode: "200", statusMessage: "Document Found", data: doc });
};

let resDocDeleted = (res, doc) => {
  return res.status(200).send({
    statusCode: "200",
    statusMessage: "Document successfully deleted ",
    data: doc,
  });
};

let resDocCancelled = (res, doc) => {
  return res.status(200).send({
    statusCode: "200",
    statusMessage: "Document Cancelled successfully ",
    data: doc,
  });
};

let resPaginationDoc = (res, doc, paginate) => {
  return res.status(200).send({
    statusCode: "200",
    statusMessage: "Document Found",
    data: doc,
    paginate,
  });
};

module.exports = {
  resNotFound,
  resServerError,
  resDocCreated,
  resDocUpdated,
  resAlreadyExists,
  resErrorOccured,
  resErrorOccuredCustom,
  resFound,
  resDocDeleted,
  resDocCancelled,
  resPaginationDoc,
  resReqProcessed,
  resDocCreatedCustom,
  resNotAuthorised,
  resAlreadyPresent,
};
