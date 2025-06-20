import { LaneNumber } from "../lane";
import { PAPA_HEALTH, PAPA_SPEED, PAPA_DAMAGE, PAPA_SCORE, PAPA_WIDTH, PAPA_HEIGHT} from "./enemies-stats";
import { Enemy } from "./enemy";
import { EnemyKind } from "./enemy-kind";

export class Papa extends Enemy {
    constructor(lane? : LaneNumber, x? : number, y?: number) {
        super(
            EnemyKind.PAPA,
            PAPA_HEALTH, 
            PAPA_SPEED, 
            PAPA_DAMAGE,
            PAPA_SCORE, 
            PAPA_WIDTH, 
            PAPA_HEIGHT, 
            lane, 
            x, 
            y
        );
    }
}
