const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');
const QuestionNotion = require('./question-notion.model.js')

module.exports = new BaseModel('Question', {
    prompt: Joi.string().required(),
    answer: Joi.string().required(),
    notion: Joi.string()
    .valid(...Object.values(QuestionNotion))
    .required()
});