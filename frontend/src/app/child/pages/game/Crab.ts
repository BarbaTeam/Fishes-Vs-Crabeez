import { Enemy } from "./Enemy";
import { GameEngine } from "./game-engine";

export class Crab extends Enemy {

    private image: HTMLImageElement;

    constructor(gameEngine: GameEngine,  canvas: HTMLCanvasElement, x?: number, y?: number) {
        super(gameEngine, canvas, x, y);

        this.image = new Image();
        this.image.src = "../../../../assets/images/game/enemy/crab_32x32.png";
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