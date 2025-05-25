const types = require('../../shared/types');
const { Grade } = require('../../shared/types/enums');



/**
 * @param {number} accuracy - The percentage of good answer to a quiz or a subset of it.
 * @returns {types.Grading} The grading corresponding to the given accuracy.
 */
exports.grade = (accuracy) => {
    if (96 <= accuracy) return {grade: Grade.S, accuracy: accuracy};
    if (90 <= accuracy) return {grade: Grade.A, accuracy: accuracy};
    if (76 <= accuracy) return {grade: Grade.B, accuracy: accuracy};
    if (46 <= accuracy) return {grade: Grade.C, accuracy: accuracy};
    if (30 <= accuracy) return {grade: Grade.D, accuracy: accuracy};
    if (21 <= accuracy) return {grade: Grade.E, accuracy: accuracy};
    if ( 0 <= accuracy) return {grade: Grade.F, accuracy: accuracy};
    return {grade: Grade.XF, accuracy: 0};
}

/**
 * @type {types.Grading}
 * Default grading when no questions answered.
 */
exports.NO_GRADING = { grade: Grade.XF, accuracy: 0 };
