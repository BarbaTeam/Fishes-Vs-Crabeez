"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENEMIES_CRATES_PER_LEVEL = exports.EnemiesCrate = void 0;
const crab_1 = require("./crab");
const hive_crab_1 = require("./hive-crab");
class EnemiesCrate {
    constructor(bank, // List of ennemy class available in the crate
    dropRates) {
        this.bank = bank;
        this.dropRates = dropRates;
    }
    genEnemy(rate, ...args) {
        for (const [i, dropRate] of Object.entries(this.dropRates)) {
            if (rate <= dropRate) {
                return new this.bank[i](args);
            }
        }
        return new this.bank[this.bank.length - 1](args);
    }
}
exports.EnemiesCrate = EnemiesCrate;
const _ENEMIES_PER_LEVEL = [
    new EnemiesCrate([crab_1.Crab, hive_crab_1.HiveCrab], [0.3, 1]), // level 0
    // TODO : Adding more crates later ...
];
exports.ENEMIES_CRATES_PER_LEVEL = new Proxy(_ENEMIES_PER_LEVEL, {
    get(target, prop) {
        if (typeof prop === "string" && /^\d+$/.test(prop)) {
            const idx = Number(prop);
            return idx < target.length
                ? target[idx]
                : _ENEMIES_PER_LEVEL[_ENEMIES_PER_LEVEL.length - 1];
        }
        return Reflect.get(target, prop);
    }
});
