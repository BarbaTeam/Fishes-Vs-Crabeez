import { EnemyKind } from "@app/shared/models/enemy-kind.model";
import { Enemy } from "./Enemy";

export class HiveCrab extends Enemy {

    private constructor(canvas: HTMLCanvasElement, id: string, x: number, y: number, speed: number, health: number, type: EnemyKind ) {
        super(canvas, id);

        this.enemyImage = new Image();
        this.enemyHitUrl = 'assets/images/game/enemy/hiveCrabHit_64x64.png';
        this.enemyUrl = 'assets/images/game/enemy/hiveCrab_64x64.png';
        this.enemyImage.src = this.enemyUrl;

        this.virtualWidth = 8;
        this.virtualHeight = 8;
        
        this.x = x;
        this.y = y;

        this.speed = speed;
        this.health = health;
        this.maxHealth = health;
        this.type = type;
    }

    public static fromJson(data: any, canvas : HTMLCanvasElement): HiveCrab {
        const crab = new HiveCrab(
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