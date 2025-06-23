import { GameEngine } from "./game-engine";

export class Layer {
    private image: HTMLImageElement;
    private speedModifier: number;
    private x: number = 0;
    private y: number = 0;

    constructor(
        private gameEngine: GameEngine,
        private canvas: HTMLCanvasElement,
        image: HTMLImageElement,
        speedModifier: number
    ) {
        this.image = image;
        this.speedModifier = speedModifier;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(
            this.image,
            this.x,
            this.y,
            this.canvas.width,
            this.canvas.height
        );
    }
}