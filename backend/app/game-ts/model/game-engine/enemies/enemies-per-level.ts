import { Enemy } from './enemy';

import { Crab } from './crab';
import { HiveCrab } from './hive-crab';



type EnemyConstructor = new (...args: any[]) => Enemy;


export class EnemiesCrate {
    public constructor(
        private readonly bank: EnemyConstructor[],  // List of ennemy class available in the crate
        private readonly dropRates: number[],       // List of the drop rate of the crate from 0 to 1
    ) {}


    public genEnemy(rate: number, ...args: any[]): Enemy {
        for (const [i, dropRate] of Object.entries(this.dropRates)) {
            if (rate <= dropRate) {
                return new this.bank[i](args);
            }
        }
        return new this.bank[this.bank.length - 1](args);
    }
}


const _ENEMIES_PER_LEVEL: EnemiesCrate[] = [
    new EnemiesCrate([Crab], [1]),                 // level 0 (pre-Papa)
    new EnemiesCrate([Crab, HiveCrab], [0.7, 1]),  // level 1
    // TODO : Adding more crates later ...
];


export const ENEMIES_CRATES_PER_LEVEL: EnemiesCrate[] = new Proxy(
    _ENEMIES_PER_LEVEL, {
        get(target, prop) {
            if (typeof prop === "string" && /^\d+$/.test(prop)) {
                const idx = Number(prop);
                return idx < target.length
                    ? target[idx]
                    : _ENEMIES_PER_LEVEL[_ENEMIES_PER_LEVEL.length-1];
            }
            return Reflect.get(target, prop);
        }
    }
);