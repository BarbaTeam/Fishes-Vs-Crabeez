const Joi = require('joi');



exports.booleanSchema = Joi.boolean();
exports.numberSchema = Joi.number();
exports.stringSchema = Joi.string().allow("");
exports.DateSchema = Joi.date().iso();
