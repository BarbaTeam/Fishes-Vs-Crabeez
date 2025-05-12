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
