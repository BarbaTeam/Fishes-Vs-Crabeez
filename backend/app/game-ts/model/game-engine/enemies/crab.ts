import { Enemy } from "./enemy";

export class Crab extends Enemy {
    constructor(lane? : 1 | 2 | 3, x? : number, y?: number) {
        super(lane, x, y);
    }
}
