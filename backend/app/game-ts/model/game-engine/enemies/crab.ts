import { Enemy } from "./enemy";

export class Crab extends Enemy {
    private static readonly CRAB_HEALTH = 1;

    constructor(lane? : 1 | 2 | 3, x? : number, y?: number) {
        super(Crab.CRAB_HEALTH, lane, x, y);
    }

    toJSON(): any {
        return super.toJSON();
    }
}
