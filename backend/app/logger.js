/* eslint-disable no-console */
const originalConsoleLog = console.log;
console.log = function consoleLog(...args) {
    const newArguments = [`[${new Date().toISOString()}]`, ...args];
    return originalConsoleLog.apply(this, newArguments);
}
console.info = console.log;

module.exports = console;
