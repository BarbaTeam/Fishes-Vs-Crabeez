import { EnemyKind } from "@app/shared/models/enemy-kind.model";
import { Enemy } from "./Enemy";

export class Papa extends Enemy {
    private constructor(canvas: HTMLCanvasElement, id: string, x: number, y: number, speed: number, health: number, type: EnemyKind) {
        super(canvas, id);

        this.enemyHitUrl = 'assets/images/game/enemy/dad_crab_hit_sh.png';
        this.enemyUrl = 'assets/images/game/enemy/dad_crab_sh.png';
        this.virtualWidth = 35;
        this.virtualHeight = 35;
        
        /*
        this.totalFrames = 8;
        this.frameDelay = 5;
        this.setAnimation(this.enemyUrl);
        */

        this.x = x;
        this.y = y;
        
        this.speed = speed;
        this.health = health;
        this.type = type;
    }

    public static fromJson(data: any, canvas : HTMLCanvasElement): Papa {
        const crab = new Papa(
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