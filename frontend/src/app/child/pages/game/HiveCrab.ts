import { Enemy } from "./Enemy";
import { GameEngine } from "./game-engine";

export class HiveCrab extends Enemy {

    private image: HTMLImageElement;

    constructor(gameEngine: GameEngine,  canvas: HTMLCanvasElement) {
        super(gameEngine, canvas);

        this.image = new Image();
        this.image.src = "../../../../assets/images/game/enemy/hiveCrab_64x64.png";
        this.speed *= 0.2;
        this.score *= 2;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const scaledWidth = this.width * 2.5;
        const scaledHeight = this.height * 2.5;
        ctx.drawImage(this.image, this.x - scaledWidth / 2, this.y - scaledHeight, scaledWidth, scaledHeight);
    }
}