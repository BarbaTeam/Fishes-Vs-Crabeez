import { EnemyKind } from "@app/shared/models/enemy-kind.model";
import { scaleToCanvas } from "../utils";

export class Enemy {
    public _id: string;
    public type!: EnemyKind;
    public x!: number;
    public y!: number;
    public virtualWidth!: number;
    public virtualHeight!: number;
    public enemyImage!: HTMLImageElement;
    public enemyHitUrl?: string;
    public enemyUrl!: string;
    public speed!: number;
    public health! : number;
    public maxHealth! : number;

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
        
        if(this.health < this.maxHealth)
            this.drawHealthBar(ctx, x, y + height, width);
    
    }

    private drawHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number): void {
        if(!this.maxHealth) return; //dans le cas d'un boss

        const healthPercentage = this.health / this.maxHealth;
        const barHeight = 4;
        console.log("health : " + this.health);
        console.log("maxhealth : " +this.maxHealth);
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(x, y, width, barHeight);
        
        ctx.fillStyle = healthPercentage > 0.6 ? "green" : 
                        healthPercentage > 0.3 ? "yellow" : "red";
        ctx.fillRect(x + 1, y + 1, (width - 2) * healthPercentage, barHeight - 2);
    }

    public update(): void {
        this.x -= this.speed;
    }
}