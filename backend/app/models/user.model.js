const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');

module.exports = new BaseModel('User', {
    name: Joi.string().required(),
    age: Joi.string().required(),
});