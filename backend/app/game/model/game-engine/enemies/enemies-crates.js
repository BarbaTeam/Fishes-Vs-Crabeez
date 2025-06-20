"use strict";
exports.ENEMIES_CRATES_PER_LEVEL = exports.EnemiesCrate = void 0;
const crab_1 = require("./crab");
const hive_crab_1 = require("./hive-crab");
class EnemiesCrate {
    constructor(bank, // List of enemy class available in the crate
    dropRates) {
        this.bank = bank;
        this.dropRates = dropRates;
    }
    genEnemy(rate, ...args) {
        for (let i = 0; i < this.dropRates.length; i++) {
            if (rate <= this.dropRates[i]) {
                return new this.bank[i](...args);
            }
        }
        return new this.bank[this.bank.length - 1](...args);
    }
}
exports.EnemiesCrate = EnemiesCrate;
const _ENEMIES_CRATES_PER_LEVEL = [
    new EnemiesCrate([crab_1.Crab], [1]), // level 0 (pre-Papa)
    new EnemiesCrate([crab_1.Crab, hive_crab_1.HiveCrab], [0.7, 1]), // level 1
    // TODO : Adding more crates later ...
];
exports.ENEMIES_CRATES_PER_LEVEL = new Proxy(_ENEMIES_CRATES_PER_LEVEL, {
    get(target, prop) {
        if (typeof prop === "string" && /^\d+$/.test(prop)) {
            const idx = Number(prop);
            if (idx < target.length) {
                return target[idx];
            }
            else {
                return target[target.length - 1]; // Correction potentielle
            }
        }
        return Reflect.get(target, prop);
    }
});
