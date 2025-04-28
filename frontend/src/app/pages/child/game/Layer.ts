import { GameEngine } from "./game-engine";

export class Layer{
    private image: HTMLImageElement;
    private speedModifier: number;
    private width: number; 
    private height: number; 
    private x: number;
    private y: number;

    constructor(private gameEngine: GameEngine, private canvas: HTMLCanvasElement, image: HTMLImageElement, speedModifier: number) {
        this.gameEngine = gameEngine;
        this.canvas = canvas;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 1000;
        this.height = 256;
        this.x=0;
        this.y=this.canvas.height - this.height;
    }   

    update(): void {
        if(this.x <= -this.width) this.x = 0;
        this.x -= this.gameEngine.speedValue * this.speedModifier;
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y);
        ctx.drawImage(this.image, this.x + this.width, this.y);
    }
}