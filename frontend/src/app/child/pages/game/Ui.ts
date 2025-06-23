import { GameEngine } from "./game-engine";

export class Ui{

    private fontSize: number;
    private fontFamily: string;
    private fontColor: string;

    constructor(
        private gameEngine: GameEngine,
        private canvas: HTMLCanvasElement
    ) {
        this.gameEngine = gameEngine;
        this.fontSize = 50;
        this.fontFamily = 'Roboto, sans-serif';
        this.fontColor = '#000000';
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        ctx.save();
        ctx.fillStyle = this.fontColor;
        ctx.font = this.fontSize + 'px ' + this.fontFamily;

        ctx.fillText(`Score: ${this.gameEngine.scoreValue}`, this.canvas.width/2 - 75, 350);

        ctx.restore();
    }
}