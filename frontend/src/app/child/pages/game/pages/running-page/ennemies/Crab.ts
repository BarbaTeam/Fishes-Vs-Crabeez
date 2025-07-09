import { EnemyKind } from "@app/shared/models/enemy-kind.model";
import { Enemy } from "./Enemy";

export class Crab extends Enemy {

    private constructor(canvas: HTMLCanvasElement, id: string, x: number, y: number, speed: number, health: number, type: EnemyKind ) {
        super(canvas, id);

        this.enemyUrl = 'assets/images/game/enemy/crab_32x32_sh.png';
        this.virtualWidth = 5;
        this.virtualHeight = 5;

        this.totalFrames = 8;
        this.frameDelay = 5;

        this.x = x;
        this.y = y;

        this.speed = speed;
        this.health = health;
        this.maxHealth = health;
        this.type = type;
    }

    public static fromJson(data: any, canvas : HTMLCanvasElement): Crab {
        const crab = new Crab(
            canvas,
            data.id, 
            data.x, 
            data.y, 
            data.speed,
            data.health,
            data.type,
        );
        return crab;
    }
}