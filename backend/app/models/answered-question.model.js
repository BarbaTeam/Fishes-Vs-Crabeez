const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');
const QuestionNotion = require('./question-notion.model.js')

module.exports = new BaseModel('AnsweredQuestion', {
    prompt: Joi.string().required(),
    expected_answer: Joi.string().required(),
    proposed_answer: Joi.string().required(),
    notion: Joi.string()
    .valid(...Object.values(QuestionNotion))
    .required()
});