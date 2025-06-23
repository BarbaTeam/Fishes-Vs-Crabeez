import { LaneNumber } from "../lane";
import { HIVECRAB_DAMAGE, HIVECRAB_HEALTH, HIVECRAB_HEIGHT, HIVECRAB_SCORE, HIVECRAB_SPEED, HIVECRAB_WIDTH } from "./enemies-stats";
import { Enemy } from "./enemy";

export class HiveCrab extends Enemy {
    constructor(lane? : LaneNumber, x? : number, y?: number) {
        super(
            "hive-crab",
            HIVECRAB_HEALTH, 
            HIVECRAB_SPEED, 
            HIVECRAB_DAMAGE,
            HIVECRAB_SCORE, 
            HIVECRAB_WIDTH, 
            HIVECRAB_HEIGHT, 
            lane, 
            x, 
            y
        );
    }
}
