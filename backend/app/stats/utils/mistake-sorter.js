const types = require('../../shared/types');
const { MistakeCategory } = require('../../shared/types/enums/mistake-category.enum');
const { QuestionNotion } = require('../../shared/types/enums/question-notion.enum');

////////////////////////////////////////////////////////////////////////////////
// Types :
////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {types.Mistake} Mistake
 */



////////////////////////////////////////////////////////////////////////////////
// Implementation :
////////////////////////////////////////////////////////////////////////////////

/**
 * Class for sorting mistakes into categories.
 */
class MistakesSorter {
    // Private constructor to prevent instantiation
    constructor() {
        throw new Error("Use MistakesSorter.sort() instead of instantiating");
    }

    /**
     * Sorts mistakes into spelling and calculation categories.
     * @param {Mistake[]} mistakes
     * @returns {{[key in MistakeCategory]: Mistake[]}}
     */
    static sort(mistakes) {
        const result = {
            [MistakeCategory.SPELLING_MISTAKES]: [],
            [MistakeCategory.CALCULATION_MISTAKES]: []
        };

        for (const m of mistakes) {
            // Encryption and rewriting are always spelling mistakes
            if (m.notion === QuestionNotion.ENCRYPTION || m.notion === QuestionNotion.REWRITING) {
                result[MistakeCategory.SPELLING_MISTAKES].push(m);
                continue;
            }

            // Check spelling mistakes
            if (MistakesSorter._isSpellingMistake(m)) {
                result[MistakeCategory.SPELLING_MISTAKES].push(m);
            }

            // Check calculation mistakes
            if (MistakesSorter._isCalculationMistake(m)) {
                result[MistakeCategory.CALCULATION_MISTAKES].push(m);
            }
        }

        return result;
    }

    /**
     * Determines if a mistake is a spelling mistake.
     * @param {Mistake} mistake
     * @returns {boolean}
     *
     * @private
     */
    static _isSpellingMistake(mistake) {
        return /^([a-z]|[-\s])+$/i.test(mistake.proposed_answer) &&
               MistakesSorter.words2num(mistake.proposed_answer) == null;
    }

    /**
     * Determines if a mistake is a calculation mistake.
     * @param {Mistake} mistake
     * @returns {boolean}
     *
     * @private
     */
    static _isCalculationMistake(mistake) {
        const expNum = MistakesSorter.words2num(mistake.expected_answer);
        const propNum = MistakesSorter.words2num(mistake.proposed_answer);

        // Direct numeric mismatch
        if (propNum != null && expNum !== propNum) {
            return true;
        }

        // Guess numbers from spelling and compare
        const guesses = MistakesSorter.guessNumbersFromSpelling(mistake.proposed_answer);
        return guesses.length > 0 && !guesses.includes(expNum);
    }

    /**
     * Computes Levenshtein distance between two strings.
     * @param {string} src
     * @param {string} dest
     * @returns {number}
     *
     * @private
     */
    static levenshtein(src, dest) {
        const dp = [];
        for (let i = 0; i <= src.length; i++) {
            dp[i] = [];
            for (let j = 0; j <= dest.length; j++) {
                dp[i][j] = i === 0 ? j : j === 0 ? i : 0;
            }
        }
        for (let i = 1; i <= src.length; i++) {
            for (let j = 1; j <= dest.length; j++) {
                const cost = src[i - 1] === dest[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost
                );
            }
        }
        return dp[src.length][dest.length];
    }

    /**
     * Converts a spelled-out number to numeric. Returns null if unrecognized.
     * @param {string} text
     * @returns {number|null}
     *
     * @private
     */
    static words2num(text) {
        if (/^-?\d+$/.test(text)) return parseInt(text, 10);

        const numberWords = {
            "zéro": 0, "un": 1, "deux": 2, "trois": 3, "quatre": 4,
            "cinq": 5, "six": 6, "sept": 7, "huit": 8, "neuf": 9,
            "dix": 10, "onze": 11, "douze": 12, "treize": 13, "quatorze": 14,
            "quinze": 15, "seize": 16, "dix-sept": 17, "dix-huit": 18, "dix-neuf": 19,
            "vingt": 20, "trente": 30, "quarante": 40, "cinquante": 50, "soixante": 60,
            "soixante-dix": 70, "quatre-vingt": 80, "quatre-vingts": 80, "quatre-vingt-dix": 90
        };
        const multipliers = {
            "cent": 100, "cents": 100,
            "mille": 1000,
            "million": 1000000, "millions": 1000000,
            "milliard": 1000000000, "milliards": 1000000000
        };

        let negative = false;
        let total = 0;
        let current = 0;
        let recognized = false;

        const tokens = text.trim().toLowerCase().split(/[-\s]+/);
        for (const token of tokens) {
            if (token === "et") continue;
            if (token === "moins") {
                negative = true;
                continue;
            }
            if (multipliers[token] != null) {
                recognized = true;
                const m = multipliers[token];
                current = m === 100 ? (current || 1) * m : (current || 1) * m;
                if (m !== 100) {
                    total += current;
                    current = 0;
                }
            } else if (numberWords[token] != null) {
                recognized = true;
                current += numberWords[token];
            } else {
                return null;
            }
        }

        const result = total + current;
        return recognized ? (negative ? -result : result) : null;
    }

    /**
     * Guesses possible numbers from a misspelled text using Levenshtein distance.
     * @param {string} text
     * @returns {number[]}
     *
     * @private
     */
    static guessNumbersFromSpelling(text) {
        const map = {
            "zéro": 0, "un": 1, "deux": 2, "trois": 3, "quatre": 4,
            "cinq": 5, "six": 6, "sept": 7, "huit": 8, "neuf": 9,
            "dix": 10, "onze": 11, "douze": 12, "treize": 13, "quatorze": 14,
            "quinze": 15, "seize": 16, "dix-sept": 17, "dix-huit": 18, "dix-neuf": 19,
            "vingt": 20, "trente": 30, "quarante": 40, "cinquante": 50, "soixante": 60,
            "soixante-dix": 70, "quatre-vingt": 80, "quatre-vingts": 80, "quatre-vingt-dix": 90
        };

        // Detect approximate "moins" at start
        let t = text.trim().toLowerCase();
        let sign = 1;
        const parts = t.split(/\s+/);
        const distToMoins = MistakesSorter.levenshtein(parts[0], "moins");
        const thresholdMinus = Math.max(1, Math.ceil("moins".length * 0.2));
        if (distToMoins <= thresholdMinus) {
            sign = -1;
            parts.shift();
            t = parts.join(" ");
        }

        let bestDist = Infinity;
        const candidates = [];
        for (const token of t.split(/[-\s]+/)) {
            let localBest = Infinity;
            let localWords = [];
            for (const w of Object.keys(map)) {
                const d = MistakesSorter.levenshtein(token, w);
                if (d < localBest) {
                    localBest = d;
                    localWords = [w];
                } else if (d === localBest) {
                    localWords.push(w);
                }
            }
            if (localBest < bestDist) {
                bestDist = localBest;
                candidates.length = 0;
                candidates.push(...localWords);
            } else if (localBest === bestDist) {
                candidates.push(...localWords);
            }
        }

        if (!candidates.length) return [];
        const threshold = Math.max(1, Math.ceil(candidates[0].length * 0.2));
        if (bestDist > threshold) return [];

        return Array.from(new Set(candidates.map(w => map[w] * sign)));
    }
}

module.exports = { MistakesSorter };
