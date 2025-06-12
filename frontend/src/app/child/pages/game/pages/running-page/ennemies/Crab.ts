import { Enemy } from "./Enemy";

export class Crab extends Enemy {

    private constructor(canvas: HTMLCanvasElement, id: string, x: number, y: number, speed: number ) {
        super(canvas, id);

        this.enemyImage = new Image();
        this.enemyImage.src = 'assets/images/game/enemy/crab_32x32.png';

        this.virtualWidth = 5;
        this.virtualHeight = 5;
        
        this.x = x;
        this.y = y;

        this.speed = speed
    }

    public static fromJson(data: any, canvas : HTMLCanvasElement): Crab {
        const crab = new Crab(
            canvas,
            data.id, 
            data.x, 
            data.y, 
            data.speed
        );
        return crab;
    }
}