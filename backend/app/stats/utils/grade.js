const types = require('../../shared/types');
const { Grade } = require('../../shared/types/enums');



/**
 * @param {number} accuracy - The percentage of good answer to a quiz or a subset of it.
 * @returns {types.Grading} The grading corresponding to the given accuracy.
 */
exports.grade = (accuracy) => {
    if (97 <= accuracy) return {grade: Grade.A_PLUS , accuracy: accuracy};
    if (93 <= accuracy) return {grade: Grade.A      , accuracy: accuracy};
    if (90 <= accuracy) return {grade: Grade.A_MINUS, accuracy: accuracy};
    if (87 <= accuracy) return {grade: Grade.B_PLUS , accuracy: accuracy};
    if (83 <= accuracy) return {grade: Grade.B      , accuracy: accuracy};
    if (80 <= accuracy) return {grade: Grade.B_MINUS, accuracy: accuracy};
    if (77 <= accuracy) return {grade: Grade.C_PLUS , accuracy: accuracy};
    if (73 <= accuracy) return {grade: Grade.C      , accuracy: accuracy};
    if (70 <= accuracy) return {grade: Grade.C_MINUS, accuracy: accuracy};
    if (67 <= accuracy) return {grade: Grade.D_PLUS , accuracy: accuracy};
    if (63 <= accuracy) return {grade: Grade.D      , accuracy: accuracy};
    if (60 <= accuracy) return {grade: Grade.D_MINUS, accuracy: accuracy};
    if ( 0 <= accuracy) return {grade: Grade.F      , accuracy: accuracy};
    return {grade: Grade.XF, accuracy: 0};
}

/**
 * @type {types.Grading}
 * Default grading when no questions answered.
 */
exports.NO_GRADING = { grade: Grade.XF, accuracy: 0 };
