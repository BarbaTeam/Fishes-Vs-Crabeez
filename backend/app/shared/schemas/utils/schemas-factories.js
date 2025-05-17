const Joi = require('joi');



exports.arraySchema = (schema) => {
    return Joi.array().items(schema).min(0);
}


exports.objectSchema = (obj) => {
    return Joi.object().keys(obj);
}


exports.enumSchema = (enumObj) => {
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


exports.regexSchema = (regex) => {
    return Joi.string().regex(regex);
}


exports.recordSchema = (keySchema, valueSchema) => {
    return Joi.object().pattern(
        keySchema, valueSchema
    );
}


exports.tupleSchema = (T1schema, T2schema) => {
    return Joi.array().ordered(T1schema, T2schema).length(2);
}


exports.unionSchema = (...schemas) => {
    return Joi.alternatives().try(...schemas);
}