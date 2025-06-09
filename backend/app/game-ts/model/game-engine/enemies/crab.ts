import { CRAB_HEALTH, CRAB_HEIGHT, CRAB_SCORE, CRAB_SPEED, CRAB_WIDTH } from "./enemies-stats";
import { Enemy } from "./enemy";

export class Crab extends Enemy {
    constructor(lane? : 1 | 2 | 3, x? : number, y?: number) {
        super(
            "crab",
            CRAB_HEALTH, 
            CRAB_SPEED, 
            CRAB_SCORE, 
            CRAB_WIDTH, 
            CRAB_HEIGHT, 
            lane, 
            x, 
            y
        );
    }
}
