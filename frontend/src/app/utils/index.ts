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
