import { Enemy } from "./Enemy";
import { GameEngine } from "./game-engine";

export class Drone extends Enemy {
     
    private image: HTMLImageElement;

    constructor(gameEngine: GameEngine,  canvas: HTMLCanvasElement, x?: number, y?: number, side?: number) {
        super(gameEngine, canvas, x, y, side);

        this.image = new Image();
        this.image.src = "../../../../assets/images/game/enemy/drone_32x32.png";
        this.speed *= 1.3;
        this.score *= 0.5
    }   

    public draw(ctx: CanvasRenderingContext2D): void {
        const scaledWidth = this.width * 0.9;
        const scaledHeight = this.height * 0.9;
        ctx.drawImage(this.image, this.x - scaledWidth / 2, this.y - scaledHeight/2, this.width, this.height);
    }
}