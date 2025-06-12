/**
 * @param {number} minN - The minimum included boundary.
 * @param {number} maxN - The maximum excluded boundary.
 * @return {number} A random integer btwn `minN` and `maxN` excluding `maxN`.
 */
exports.randint = (minN, maxN) => {
    return Math.min(Math.floor(Math.random() * (maxN - minN + 1)) + minN, maxN - 1);
}


/**
 * @param {number} bias
 * @param {number} midpoint
 * @param {number} minN - The minimum included boundary.
 * @param {number} maxN - The maximum excluded boundary.
 * @param {number} [biasExp]
 * @returns {number} A random integer btwn `minN` and `maxN` excluding `maxN`.
 */
exports.biasedRandint = (
    bias,
    midpoint,

    minN,
    maxN,

    biasExp = Math.E,
) => {
    let t, exponent, x;

    if (bias <= midpoint) {
            // Low bias (toward minN):
            t = (midpoint - bias) / (midpoint - 1);
            exponent = 1 + t * (biasExp - 1);
            x = Math.pow(Math.random(), exponent);
    } else {
            // High bias (toward maxN):
            t = (bias - midpoint) / (10 - midpoint);
            exponent = 1 + t * (biasExp - 1);
            x = 1 - Math.pow(Math.random(), exponent);
    }

    return Math.min(Math.floor(x * (maxN - minN)) + minN, maxN - 1);
}
