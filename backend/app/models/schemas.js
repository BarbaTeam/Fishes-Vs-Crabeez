const Joi = require('joi');



////////////////////////////////////////////////////////////////////////////////
// Schemas :
////////////////////////////////////////////////////////////////////////////////

const UserIDSchema = Joi.string().regex(/^u[0-9]+$/).required();
const GameIDSchema = Joi.string().regex(/^g[0-9]+$/).required();



////////////////////////////////////////////////////////////////////////////////
// Schemas Factories :
////////////////////////////////////////////////////////////////////////////////

function arraySchema(schema) {
    return Joi.array().items(schema);
}


function objectSchema(obj) {
    return Joi.object().keys(obj);
}


function enumSchema(enumObj) {
    const values = Array.from(new Set(Object.values(enumObj)));

    const stringValues = values.filter(v => typeof v === 'string');
    const numberValues = values.filter(v => typeof v === 'number');
    const booleanValues = values.filter(v => typeof v === 'boolean');

    const schemas = [];

    if (stringValues.length) {
        schemas.push(Joi.string().valid(...stringValues));
    }
    if (numberValues.length) {
        schemas.push(Joi.number().valid(...numberValues));
    }
    if (booleanValues.length) {
        schemas.push(Joi.boolean().valid(...booleanValues));
    }

    // If `enumObj` isn't a mixed enum
    if (schemas.length === 1) {
        return schemas[0];
    }

    // If `enumObj` is a mixed enum
    return Joi.alternatives().try(...schemas);
}


module.exports = {
    GameIDSchema,
    UserIDSchema,

    // Utils :
    arraySchema,
    enumSchema,
    objectSchema,
};