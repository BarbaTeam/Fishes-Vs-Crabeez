import { Enemy } from "./Enemy";

export class Papa extends Enemy {
    private constructor(canvas: HTMLCanvasElement, id: string, x: number, y: number, speed: number, health: number ) {
        super(canvas, id);

        this.enemyImage = new Image();
        this.enemyHitUrl = 'assets/images/game/enemy/dad_crab_hit.png';
        this.enemyUrl = 'assets/images/game/enemy/dad_crab.png';
        this.enemyImage.src = this.enemyUrl;
        this.virtualWidth = 35;
        this.virtualHeight = 35;
        
        this.x = x;
        this.y = y;
        
        this.speed = speed;
        this.health = health;
    }

    public static fromJson(data: any, canvas : HTMLCanvasElement): Papa {
        const crab = new Papa(
            canvas,
            data.id, 
            data.x, 
            data.y, 
            data.speed,
            data.health,
        );
        return crab;
    }
}