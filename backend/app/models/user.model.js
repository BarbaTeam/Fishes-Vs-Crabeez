const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');
const UserConfig = require('./user-config.model.js')

module.exports = new BaseModel('User', {
    name: Joi.string().required(),
    age: Joi.string().required(),
    icon: Joi.string().required(),
    userConfig: UserConfig.required()
});