import { GameEngine } from "../game-engine";
import { scaleToCanvas } from "../utils";

export class Enemy {
    public _id: string;
    public x!: number;
    public y!: number;
    public virtualWidth!: number;
    public virtualHeight!: number;
    public enemyImage!: HTMLImageElement;
    public enemyHitUrl?: string;
    public enemyUrl!: string;
    public speed!: number;
    public health! : number;
    
    constructor(
        private canvas: HTMLCanvasElement,
        id : string,
    ) {
        this._id = id;
    }
    public get id(): string {
        return this._id;
    }

    public get position(): {x:number, y:number} {
        return {x: this.x, y: this.y};
    }
    
    public draw(ctx: CanvasRenderingContext2D): void {
        const { x, y, width, height } = scaleToCanvas(
            this.x,
            this.y,
            this.virtualWidth,
            this.virtualHeight,
            this.canvas,
            this.enemyImage,
        );        
        ctx.drawImage(this.enemyImage, x, y, width, height); 
    }

    public update(): void {
        this.x -= this.speed;
    }
}