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
        const scaledWidth = this.width * 1.5;
        const scaledHeight = this.height * 1.5;
        ctx.drawImage(this.image, this.x - scaledWidth / 2, this.y - scaledHeight/2, this.width, this.height);
    }
}