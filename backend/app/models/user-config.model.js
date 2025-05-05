const Joi = require('joi');

const UserConfig = Joi.object({
    showsAnswer: Joi.boolean().required(),
    readingAssistance: Joi.boolean().required(),
    advancedStats: Joi.boolean().required(),
    leaderBoard: Joi.boolean().required(),
    fontSize: Joi.number().required(),
    sound: Joi.number().required(),
    numberRewrite: Joi.boolean().required(),
    addition: Joi.boolean().required(),
    soustraction: Joi.boolean().required(),
    multiplication: Joi.boolean().required(),
    division: Joi.boolean().required(),
    encryption: Joi.boolean().required(),
    equation: Joi.boolean().required(),
});

module.exports = UserConfig;