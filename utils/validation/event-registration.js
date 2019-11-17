const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEventRegisterInput(data) {
  //console.log(data);
  let errors = {};

  data.creator = !isEmpty(data.creator) ? data.creator : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.deadline = !isEmpty(data.deadline) ? data.deadline : "";
  data.venue = !isEmpty(data.venue) ? data.venue : "";

  if (Validator.isEmpty(data.creator)) {
    errors.creator = "user is required";
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = "title is required";
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = "description is required";
  }
  if (Validator.isEmpty(data.venue)) {
    errors.venue = "venue is required";
  }
  if (Validator.isEmpty(data.deadline)) {
    errors.deadline = "deadline is required";
  }

  // if (Validator.isEmpty(data.date)) {
  //   errors.date = "date is required";
  // }

  // if (Validator.isEmpty(data.type)) {
  //   errors.type = "type is required";
  // }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
