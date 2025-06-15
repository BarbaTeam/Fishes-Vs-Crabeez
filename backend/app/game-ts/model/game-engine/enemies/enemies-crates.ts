import { Enemy } from './enemy';

import { Crab } from './crab';
import { HiveCrab } from './hive-crab';



type EnemyConstructor = new (...args: any[]) => Enemy;


export class EnemiesCrate {
    public constructor(
        private readonly bank: EnemyConstructor[],  // List of enemy class available in the crate
        private readonly dropRates: number[],       // List of the drop rate of the crate from 0 to 1
    ) {}

    public genEnemy(rate: number, ...args: any[]): Enemy {
        for (let i = 0; i < this.dropRates.length; i++) {
            if (rate <= this.dropRates[i]) {
                return new this.bank[i](...args);
            }
        }
        return new this.bank[this.bank.length - 1](...args);
    }
}


const _ENEMIES_CRATES_PER_LEVEL: EnemiesCrate[] = [
    new EnemiesCrate([Crab], [1]),                 // level 0 (pre-Papa)
    new EnemiesCrate([Crab, HiveCrab], [0.7, 1]),  // level 1
    // TODO : Adding more crates later ...
];



export const ENEMIES_CRATES_PER_LEVEL: EnemiesCrate[] = new Proxy(
    _ENEMIES_CRATES_PER_LEVEL, {
        get(target, prop) {
            if (typeof prop === "string" && /^\d+$/.test(prop)) {
                const idx = Number(prop);

                if (idx < target.length) {
                    return target[idx];
                } else {
                    return target[target.length-1]; // Correction potentielle
                }
            }
            return Reflect.get(target, prop);
        }
    }
);
