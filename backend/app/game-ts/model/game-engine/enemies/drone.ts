import { LaneNumber } from "../lane";
import { DRONE_DAMAGE, DRONE_HEIGHT, DRONE_HEALTH, DRONE_SCORE, DRONE_SPEED, DRONE_WIDTH } from "./enemies-stats";
import { Enemy } from "./enemy";

export class Drone extends Enemy {
    constructor(lane? : LaneNumber, x? : number, y?: number) {
        super(
            "drone",
            DRONE_HEALTH, 
            DRONE_SPEED, 
            DRONE_DAMAGE,
            DRONE_SCORE, 
            DRONE_WIDTH, 
            DRONE_HEIGHT, 
            lane, 
            x, 
            y
        );
    }
}
