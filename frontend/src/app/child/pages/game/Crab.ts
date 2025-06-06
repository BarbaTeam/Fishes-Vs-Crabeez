import { Enemy } from "./Enemy";
import { GameEngine } from "./game-engine";

export class Crab extends Enemy {

    private image: HTMLImageElement;

    private constructor(canvas: HTMLCanvasElement, x: number, y: number, lane: number ) {
        super(canvas, x, y, lane);

        this.image = new Image();
        this.image.src = "../../../../assets/images/game/enemy/crab_32x32.png";
    }

    public static fromJson(data: any, canvas : HTMLCanvasElement): Crab {
        const crab = new Crab(canvas, data.x, data.y, data.lane);
        return crab;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(
            this.image,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }
}