const { Question } = require('../../shared/types');
const { QuestionNotion } = require('../../shared/types/enums');



////////////////////////////////////////////////////////////////////////////////
// Utils :
////////////////////////////////////////////////////////////////////////////////

/**
 * Convert a number to its French words representation.
 * @param {number} n
 * @returns {string}
 */
function num2words_fr(n) {
    ////////////////////////////////////////////////////////////////////////////
    // Constants:

    const UNITS = [
        "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit",
        "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"
    ];
    const TENS = [
        "", "", "vingt", "trente", "quarante", "cinquante", "soixante"
    ];
    const DENOMINATIONS = [
        { value: 1e9, singular: "milliard", plural: "millions" },
        { value: 1e6, singular: "million", plural: "millions" },
        { value: 1e3, singular: "mille", plural: "mille" }
    ];

    ////////////////////////////////////////////////////////////////////////////
    // Helper Function:

    /**
     * Convert numbers less than 1000 to words.
     * @param {number} num
     * @returns {string}
     */
    function convertLessThanOneThousand(num) {
        let current = "";

        if (num >= 100) {
            let hundred = Math.floor(num / 100);
            num = num % 100;
            if (hundred === 1) {
                current += "cent";
            } else {
                current += UNITS[hundred] + " cent";
            }
            // Add "s" to "cent" if exact and greater than one
            if (num === 0 && hundred > 1) {
                current += "s";
            }
            if (num > 0) current += " ";
        }

        if (num < 17) {
            current += UNITS[num];
        } else if (num < 20) {
            current += "dix-" + UNITS[num - 10];
        } else if (num < 70) {
            let ten = Math.floor(num / 10);
            let unit = num % 10;
            current += TENS[ten];
            if (unit === 1) {
                current += " et un";
            } else if (unit > 0) {
                current += "-" + UNITS[unit];
            }
        } else if (num < 80) {
            let unit = num - 60;
            current += "soixante";
            if (unit === 11) {
                current += " et " + UNITS[unit];
            } else {
                current += "-" + num2words_fr(unit);
            }
        } else if (num < 100) {
            let unit = num - 80;
            current += "quatre-vingt";
            if (unit === 0) {
                current += "s";
            } else if (unit === 1) {
                current += "-un";
            } else {
                current += "-" + UNITS[unit];
            }
        }

        return current;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Main Logic:

    if (!Number.isFinite(n)) {
        throw new Error("Can only convert finite number");
    }
    if (n === 0) {
        return "zéro";
    }
    if (n < 0) {
        return "moins " + num2words_fr(-n);
    }

    let ret = "";
    let remainder = n;
    for (let i = 0; i < DENOMINATIONS.length; i++) {
        const { value, singular, plural } = DENOMINATIONS[i];
        if (remainder >= value) {
            let count = Math.floor(remainder / value);
            remainder = remainder % value;

            // For "mille" we don't say "un mille"
            if (value === 1e3 && count === 1) {
                ret += "mille";
            } else {
                ret += num2words_fr(count) + " " + (count > 1 ? plural : singular);
            }
            if (remainder > 0) ret += " ";
        }
    }

    if (remainder > 0) {
        ret += convertLessThanOneThousand(remainder);
    }

    return ret;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Filters an array by a boolean mask.
 * @template T
 * @param {T[]} arr - Array to filter
 * @param {boolean[]} mask - Mask indicating which items to keep
 * @returns {T[]}
 */
function filterOnMask(arr, mask) {
    return arr.filter((_, index) => mask[index]);
}



////////////////////////////////////////////////////////////////////////////////
// Question Generator:
////////////////////////////////////////////////////////////////////////////////

/**
 * @class QuestionsGenerator
 */
class QuestionsGenerator {
    /**
     * Choose a random notion from the mask.
     * @private
     * @param {boolean[]} mask
     * @returns {QuestionNotionType}
     */
    static _chooseNotion(mask) {
        const notions = Object.values(QuestionNotion);
        const allowedNotions = filterOnMask(notions, mask);
        if (allowedNotions.length === 0) {
            throw new Error("No notion allowed by the provided mask.");
        }
        return allowedNotions[randint(0, allowedNotions.length - 1)];
    }

    /**
     * Convert a notion to its operator symbol.
     * @private
     * @param {QuestionNotionType} notion
     * @returns {string}
     */
    static _convertNotionToOperator(notion) {
        switch (notion) {
            case QuestionNotion.ADDITION:
                return "+";
            case QuestionNotion.SUBSTRACTION:
                return "-";
            case QuestionNotion.MULTIPLICATION:
                return "*";
            case QuestionNotion.DIVISION:
                return "/";
            default:
                return "NA";
        }
    }

    /**
     * Choose random operands between bounds.
     * @private
     * @param {number} [operandsAmount=2]
     * @param {number} [minBound=0]
     * @param {number} [maxBound=10]
     * @returns {number[]}
     */
    static _chooseOperands(operandsAmount = 2, minBound = 0, maxBound = 10) {
        const operands = [];
        for (let i = 0; i < operandsAmount; i++) {
            operands.push(randint(minBound, maxBound));
        }
        return operands;
    }

    /**
     * Compute the answer given operands and operator.
     * @private
     * @param {number[]} operands
     * @param {string} operator
     * @returns {number}
     */
    static _computeAnswer(operands, operator) {
        switch (operator) {
            case "+":
                return operands[0] + operands[1];
            case "-":
                return operands[0] - operands[1];
            case "*":
                return operands[0] * operands[1];
            case "/":
                return Math.floor(operands[0] / operands[1]);
            default:
                throw new Error(`Unexpected operator: ${operator}`);
        }
    }

    /**
     * Generate a random encrypted string of given length.
     * @private
     * @param {number} length
     * @returns {string}
     */
    static _genEncryptedString(length) {
        // TODO: expand character set if needed
        const characters = "!\"#$%&'()*+,-./:;<=>?@[\\]^_{|}";
        let ret = "";
        for (let i = 0; i < length; i++) {
            ret += characters.charAt(randint(0, characters.length - 1));
        }
        return ret;
    }

    /**
     * Generate a question based on a notion mask.
     * @param {boolean[]} [notionMask=[true, true, false, false, false, false, false]]
     * @returns {Question}
     */
    static genQuestion(notionMask = [true, true, false, false, false, false, false]) {
        const notion = this._chooseNotion(notionMask);

        switch (notion) {
            case QuestionNotion.REWRITING: {
                const nb = randint(0, 50);
                return {
                    prompt: `${nb} :\xa0`,
                    answer: num2words_fr(nb),
                    notion
                };
            }
            case QuestionNotion.ENCRYPTION: {
                const length = randint(4, 6);
                return {
                    prompt: "",
                    answer: this._genEncryptedString(length),
                    notion
                };
            }
            case QuestionNotion.EQUATION:
                // TODO: implement equation case in the future
                return this.genQuestion(notionMask);

            default: {
                const operator = this._convertNotionToOperator(notion);
                const operands = this._chooseOperands();
                const ans = this._computeAnswer(operands, operator);
                return {
                    prompt: `${operands[0]} ${operator} ${operands[1]} =\xa0`,
                    answer: num2words_fr(ans),
                    notion
                };
            }
        }
    }
}



module.exports = {
    QuestionsGenerator
};
