import { LaneNumber } from "../lane";
import { CRAB_DAMAGE, CRAB_HEALTH, CRAB_HEIGHT, CRAB_SCORE, CRAB_SPEED, CRAB_WIDTH } from "./enemies-stats";
import { Enemy } from "./enemy";
import { EnemyKind } from "./enemy-kind";

export class Crab extends Enemy {
    constructor(lane? : LaneNumber, x? : number, y?: number) {
        super(
            EnemyKind.CRAB,
            CRAB_HEALTH, 
            CRAB_SPEED, 
            CRAB_DAMAGE,
            CRAB_SCORE, 
            CRAB_WIDTH, 
            CRAB_HEIGHT, 
            lane, 
            x, 
            y
        );
    }
}
