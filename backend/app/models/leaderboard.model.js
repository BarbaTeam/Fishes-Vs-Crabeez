const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');
const { Grade } = require('./grade.model.js');
const { enumSchema, objectSchema, arraySchema } = require('./schemas.js');

module.exports = new BaseModel('LeaderBoard', {
    ranking: Joi.array().items(Joi.string().required()).required(),
    gradingPerPlayer: arraySchema(objectSchema({
        grade: enumSchema(Grade),
        accuracy: Joi.number().required(),
    }))
});