"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsGenerator = void 0;
const types_1 = require("../../../../shared/types");
const random_1 = require("../../../../shared/utils/random");
////////////////////////////////////////////////////////////////////////////////
// Utils :
////////////////////////////////////////////////////////////////////////////////
function num2words_fr(n) {
    ////////////////////////////////////////////////////////////////////////////
    // Constantes :
    const UNITS = [
        "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit",
        "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"
    ];
    const TENS = [
        "", "", "vingt", "trente", "quarante", "cinquante", "soixante"
    ];
    const DENOMINATIONS = [
        { value: 1e9, singular: "milliard", plural: "milliards" },
        { value: 1e6, singular: "million", plural: "millions" },
        { value: 1e3, singular: "mille", plural: "mille" }
    ];
    ////////////////////////////////////////////////////////////////////////////
    // Helper Function :
    function convertLessThanOneThousand(num) {
        let current = "";
        if (num >= 100) {
            let hundred = Math.floor(num / 100);
            num = num % 100;
            if (hundred === 1) {
                current += "cent";
            }
            else {
                current += UNITS[hundred] + " cent";
            }
            // Ajoute un "s" à "cent" uniquement s'il n'est pas suivi et qu'il est exact
            if (num === 0 && hundred > 1) {
                current += "s";
            }
            if (num > 0)
                current += " ";
        }
        if (num < 17) { // de 0 à 16
            current += UNITS[num];
        }
        else if (num < 20) { // 17, 18, 19
            current += "dix-" + UNITS[num - 10];
        }
        else if (num < 70) { // 20 à 69
            let ten = Math.floor(num / 10);
            let unit = num % 10;
            current += TENS[ten];
            if (unit === 1) {
                current += " et un";
            }
            else if (unit > 0) {
                current += "-" + UNITS[unit];
            }
        }
        else if (num < 80) { // 70 à 79
            // 70 = soixante-dix, 71 = soixante et onze, ...
            let unit = num - 60;
            current += "soixante";
            if (unit === 11) { // 71 : soixante et onze
                current += " et " + UNITS[unit];
            }
            else {
                current += "-" + num2words_fr(unit);
            }
        }
        else if (num < 100) { // 80 à 99
            let unit = num - 80;
            // 80 est "quatre-vingts" si pas de reste, sinon "quatre-vingt"
            current += "quatre-vingt";
            if (unit === 0) {
                current += "s";
            }
            else if (unit === 1) {
                current += "-un";
            }
            else {
                current += "-" + UNITS[unit];
            }
        }
        return current;
    }
    ////////////////////////////////////////////////////////////////////////////
    // Main Logic :
    if (!Number.isFinite(n)) {
        console.log(n);
        throw new Error("Can only convert finite number");
    }
    if (n === 0) {
        return "zéro";
    }
    if (n < 0) {
        return "moins " + num2words_fr(-n);
    }
    ;
    let ret = "";
    let remainder = n;
    for (let i = 0; i < DENOMINATIONS.length; i++) {
        const { value, singular, plural } = DENOMINATIONS[i];
        if (remainder >= value) {
            let count = Math.floor(remainder / value);
            remainder = remainder % value;
            // Pour "mille" on ne dit pas "un mille"
            if (value === 1e3 && count === 1) {
                ret += "mille";
            }
            else {
                ret += num2words_fr(count) + " " + (count > 1 ? plural : singular);
            }
            if (remainder > 0)
                ret += " ";
        }
    }
    if (remainder > 0) {
        ret += convertLessThanOneThousand(remainder);
    }
    return ret;
}
////////////////////////////////////////////////////////////////////////////////
// Question Generator :
////////////////////////////////////////////////////////////////////////////////
class QuestionsGenerator {
    static _chooseNotion(mask) {
        const notions = Object.values(types_1.QuestionNotion);
        const allowedNotions = notions.filter((notion) => mask[notion]);
        if (allowedNotions.length === 0) {
            throw new Error("Aucune notion autorisée par le masque fourni.");
        }
        return allowedNotions[(0, random_1.randint)(0, allowedNotions.length - 1)];
    }
    static _convertNotionToOperator(notion) {
        switch (notion) {
            case types_1.QuestionNotion.ADDITION:
                return '+';
            case types_1.QuestionNotion.SUBSTRACTION:
                return '-';
            case types_1.QuestionNotion.MULTIPLICATION:
                return '*';
            case types_1.QuestionNotion.DIVISION:
                return '/';
            default:
                return 'NA';
        }
    }
    static _chooseOperands(minBound = 0, maxBound = 10) {
        const operands = [];
        operands.push((0, random_1.randint)(minBound, maxBound));
        operands.push((0, random_1.randint)(Math.max(1, minBound), maxBound));
        return operands;
    }
    static _computeAnswer(operands, operator) {
        switch (operator) {
            case '+':
                return operands[0] + operands[1];
            case '-':
                return operands[0] - operands[1];
            case '*':
                return operands[0] * operands[1];
            case '/':
                // Division entière
                return Math.floor(operands[0] / operands[1]);
            default:
                throw new Error(`Unexpected operator: ${operator}`);
        }
    }
    static _genEncryptedString(length) {
        // TODO : utiliser l'ensemble complet des caractères si besoin
        const characters = "!\"#$%&'()*+,-./:;<=>?@[\\]^_{|}";
        let ret = "";
        for (let i = 0; i < length; i++) {
            ret += characters.charAt((0, random_1.randint)(0, characters.length - 1));
        }
        return ret;
    }
    // Mask : "ADDITION" | "SUBSTRACTION" | "MULTIPLICATION" | "DIVISION" | "REWRITING" | "ENCRYPTION" | "EQUATION"
    static genQuestion(notionMask = {
        [types_1.QuestionNotion.ADDITION]: true,
        [types_1.QuestionNotion.SUBSTRACTION]: true,
        [types_1.QuestionNotion.MULTIPLICATION]: false,
        [types_1.QuestionNotion.DIVISION]: false,
        [types_1.QuestionNotion.EQUATION]: false,
        [types_1.QuestionNotion.REWRITING]: false,
        [types_1.QuestionNotion.ENCRYPTION]: false,
    }) {
        let notion = this._chooseNotion(notionMask);
        // TODO : Supporting equation one day
        while (notion === types_1.QuestionNotion.EQUATION) {
            notion = this._chooseNotion(notionMask);
        }
        return this.genQuestionOfNotion(notion);
    }
    static genQuestionOfNotion(notion) {
        switch (notion) {
            case types_1.QuestionNotion.REWRITING:
                const nb = (0, random_1.randint)(0, 50);
                return {
                    prompt: `${nb} :\xa0`,
                    answer: num2words_fr(nb),
                    notion: notion,
                };
            case types_1.QuestionNotion.ENCRYPTION:
                const length = (0, random_1.randint)(4, 6);
                return {
                    prompt: "",
                    answer: this._genEncryptedString(length),
                    notion: notion,
                };
            case types_1.QuestionNotion.EQUATION:
                // TODO : Supporting equation one day
                throw new Error("Equation generation ain't currently supported");
            default:
                const operator = this._convertNotionToOperator(notion);
                const operands = this._chooseOperands();
                const ans = this._computeAnswer(operands, operator);
                return {
                    prompt: `${operands[0]} ${operator} ${operands[1]} =\xa0`,
                    //prompt: `${operands[0]} ${operator} ${operands[1]} =&nbsp;`,
                    answer: num2words_fr(ans),
                    notion: notion
                };
        }
    }
}
exports.QuestionsGenerator = QuestionsGenerator;
