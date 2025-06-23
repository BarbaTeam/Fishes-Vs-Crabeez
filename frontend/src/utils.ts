export class AssertionError extends Error {
    constructor(msg: string) {super(msg)}
}

export function assert(condition: unknown, message?: string): asserts condition {
    if (condition) {
        return;
    }

    if (message) {
        throw new AssertionError(`AssertionError: ${message}`);
    }

    throw new AssertionError("AssertionError");
}


/**
 * @param min The minimum included boundary.
 * @param max The maximum excluded boundary.
 * @reurn A random integer btwn 'min' and 'max'.
 */
export function randint(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * @param arr An array to filter.
 * @param mask The filtering mask.
 * @return The filtered array.
 */
export function filterOnMask<T>(arr: T[], mask: boolean[]): T[] {
    return arr.filter((_, index) => mask[index]);
}



////////////////////////////////////////////////////////////////////////////////
// Backend Utils :
// TODO : Removing it from the frontend
////////////////////////////////////////////////////////////////////////////////

export function num2words_fr(n:number): string {
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
