const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileRegisterInput(data) {
  //console.log(data);
  let errors = {};

  data.user = !isEmpty(data.user) ? data.user : "";
  data.enrollment_id = !isEmpty(data.enrollment_id) ? data.enrollment_id : "";
  data.course = !isEmpty(data.course) ? data.course : "";
  data.institute = !isEmpty(data.institute) ? data.institute : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";

  if (Validator.isEmpty(data.user)) {
    errors.user = "user is required";
  }

  if (Validator.isEmpty(data.enrollment_id)) {
    errors.enrollment_id = "enrollment_id is required";
  }

  if (Validator.isEmpty(data.course)) {
    errors.course = "course is required";
  }

  if (Validator.isEmpty(data.institute)) {
    errors.institute = "institute is required";
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = "phone is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
