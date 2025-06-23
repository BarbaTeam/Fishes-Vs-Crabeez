import { VIRTUAL_WIDTH } from "../../../../game/model/game-engine/variables";
import { randint } from "../../../../shared/utils/random";
import { Lane, LaneNumber } from "../lane";
import { bandHeight, LANES } from "../variables";


export type EnemyID = `ennemy-${number}`;



export class Enemy {
    public static nextId = 0;
    public readonly id: EnemyID;
    public readonly lane: Lane;
    public x: number;
    public y: number;

    public alive: boolean;


    constructor(
        public type : string,
        public health: number,
        public speed : number,
        public readonly score: number,

        public readonly width : number,
        public readonly height : number,

        laneNum? : LaneNumber,
        x? : number,
        y? : number,
    ) {
        this.id = `ennemy-${Enemy.nextId++}`;

        this.lane = LANES[
            laneNum !== undefined
            ? laneNum - 1
            : randint(0, 3)
        ];
        this.x = this._computeInitialXPosition(x);
        this.y = this._computeInitialYPosition(y);

        this.width = width;
        this.height = height;
        
        this.health = health;
        this.speed = speed;
        
        this.alive = true;
        this.score = score;
    }

    private _computeInitialXPosition(
        providedX : number | undefined
    ) {
        if (providedX !== undefined) {
            return providedX;
        }

        return VIRTUAL_WIDTH + this.width;
    }

    private _computeInitialYPosition(
        providedY : number | undefined
    ) {
        if (providedY !== undefined) {
            return providedY;
        }

        switch (this.lane.num) {
            case 1:
                return bandHeight * 3.5;
            case 2:
                return bandHeight * 2.5;
            case 3:
                return bandHeight * 1.5;
            default:
                return bandHeight * 1.5;
        }
    }

    public destroy() {
        this.alive = false;
    }

    public update() {
        this.x -= this.speed;
    }

    toJSON(): any {
        return {
            id    : this.id,
            type  : this.type,
            x     : this.x,
            y     : this.y,
            speed : this.speed,
        };
    }
}