const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateTaskInput(data) {
  let errors = {};

  data.task_id = !isEmpty(data.task_id) ? data.task_id : '';
  data.name = !isEmpty(data.name) ? data.name : '';
  data.client = !isEmpty(data.client) ? data.client : '';
  data.assigned_to = !isEmpty(data.assigned_to) ? data.assigned_to : '';
  data.supervisor = !isEmpty(data.supervisor) ? data.supervisor : '';
  data.deadline = !isEmpty(data.deadline) ? data.deadline : '';
 
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  if (Validator.isEmpty(data.name)){
    errors.name = 'Name is required'
  }

  if (Validator.isEmpty(data.task_id)){
    errors.task_id = 'Task id is required'
 }

  if (data.client === ''){
    errors.client = 'Client is required'
  }
  if (data.assigned_to === ''){
    errors.assigned_to = 'Assigned to field is required'
  }
  if (data.supervisor === ''){
      errors.supervisor = 'Supervisor is required'
  }
  if (data.deadline === ''){
      errors.deadline = 'Deadline is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
