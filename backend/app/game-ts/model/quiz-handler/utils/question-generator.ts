import { Question, QuestionNotion } from '../../../../shared/types';
import { randint } from '../../../../shared/utils/random';


////////////////////////////////////////////////////////////////////////////////
// Utils :
////////////////////////////////////////////////////////////////////////////////

function num2words_fr(n:number): string {
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

    function convertLessThanOneThousand(num: number): string {
        let current = "";

        if (num >= 100) {
            let hundred = Math.floor(num / 100);
            num = num % 100;
            if (hundred === 1) {
                current += "cent";
            } else {
                current += UNITS[hundred] + " cent";
            }
            // Ajoute un "s" à "cent" uniquement s'il n'est pas suivi et qu'il est exact
            if (num === 0 && hundred > 1) {
                current += "s";
            }
            if (num > 0) current += " ";
        }

        if (num < 17) { // de 0 à 16
            current += UNITS[num];
        } else if (num < 20) { // 17, 18, 19
            current += "dix-" + UNITS[num - 10];
        } else if (num < 70) {  // 20 à 69
            let ten = Math.floor(num / 10);
            let unit = num % 10;
            current += TENS[ten];
            if (unit === 1) {
                current += " et un";
            } else if (unit > 0) {
                current += "-" + UNITS[unit];
            }
        } else if (num < 80) { // 70 à 79
            // 70 = soixante-dix, 71 = soixante et onze, ...
            let unit = num - 60;
            current += "soixante";
            if(unit === 11) { // 71 : soixante et onze
                current += " et " + UNITS[unit];
            } else {
                current += "-" + num2words_fr(unit);
            }
        } else if (num < 100) { // 80 à 99
            let unit = num - 80;
            // 80 est "quatre-vingts" si pas de reste, sinon "quatre-vingt"
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
    // Main Logic :

    if (!Number.isFinite(n)) {
        throw new Error("Can only convert finite number");
    }
    if (n === 0) {
        return "zéro";
    }
    if (n < 0) {
        return "moins " + num2words_fr(-n)
    };

    let ret = "";
    let remainder = n;
    for (let i=0; i < DENOMINATIONS.length; i++) {
        const { value, singular, plural } = DENOMINATIONS[i];
        if (remainder >= value) {
            let count = Math.floor(remainder / value);
            remainder = remainder % value;

            // Pour "mille" on ne dit pas "un mille"
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



////////////////////////////////////////////////////////////////////////////////
// Question Generator :
////////////////////////////////////////////////////////////////////////////////

export class QuestionsGenerator {
    private static _chooseNotion(mask: Record<QuestionNotion, boolean>): QuestionNotion {
        const notions = Object.values(QuestionNotion) as QuestionNotion[];
        const allowedNotions = notions.filter((notion) => mask[notion]);

        if (allowedNotions.length === 0) {
            throw new Error("Aucune notion autorisée par le masque fourni.");
        }

        return allowedNotions[randint(0, allowedNotions.length - 1)];
    }

    private static _convertNotionToOperator(notion: QuestionNotion): string {
        switch (notion) {
            case QuestionNotion.ADDITION:
                return '+';
            case QuestionNotion.SUBSTRACTION:
                return '-';
            case QuestionNotion.MULTIPLICATION:
                return '*';
            case QuestionNotion.DIVISION:
                return '/';
            default:
                return 'NA';
        }
    }

    private static _chooseOperands(minBound: number = 0, maxBound: number = 10): number[] {
        const operands: number[] = [];
        operands.push(randint(minBound, maxBound));
        operands.push(randint(Math.max(1, minBound), maxBound));
        return operands;
    }

    private static _computeAnswer(operands: number[], operator: string): number {
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

    private static _genEncryptedString(length: number): string {
        // TODO : utiliser l'ensemble complet des caractères si besoin
        const characters = "!\"#$%&'()*+,-./:;<=>?@[\\]^_{|}";

        let ret = "";
        for (let i = 0; i < length; i++) {
            ret += characters.charAt(randint(0, characters.length - 1));
        }
        return ret;
    }

    // Mask : "ADDITION" | "SUBSTRACTION" | "MULTIPLICATION" | "DIVISION" | "REWRITING" | "ENCRYPTION" | "EQUATION"
    public static genQuestion(
        notionMask: Record<QuestionNotion, boolean> = {
            [QuestionNotion.ADDITION]      : true,
            [QuestionNotion.SUBSTRACTION]  : true,
            [QuestionNotion.MULTIPLICATION]: false,
            [QuestionNotion.DIVISION]      : false,
            [QuestionNotion.EQUATION]      : false,
            [QuestionNotion.REWRITING]     : false,
            [QuestionNotion.ENCRYPTION]    : false,
        }
    ): Question {
        let notion = this._chooseNotion(notionMask);

        // TODO : Supporting equation one day
        while (notion === QuestionNotion.EQUATION) {
            notion = this._chooseNotion(notionMask);
        }

        return this.genQuestionOfNotion(notion);
    }

    public static genQuestionOfNotion(notion: QuestionNotion): Question {
        switch (notion) {
            case QuestionNotion.REWRITING:
                const nb = randint(0, 50);
                return {
                    prompt: `${nb} :\xa0`,
                    answer: num2words_fr(nb),
                    notion: notion,
                };

            case QuestionNotion.ENCRYPTION:
                const length = randint(4, 6);
                return {
                    prompt: "",
                    answer: this._genEncryptedString(length),
                    notion: notion,
                };

            case QuestionNotion.EQUATION :
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
