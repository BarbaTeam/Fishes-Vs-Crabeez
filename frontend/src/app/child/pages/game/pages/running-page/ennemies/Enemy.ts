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
    public health!: number;
    public maxHealth!: number;

    private deadEffectScale?: { width: number; height: number };
    private animationFrame: number = 0;
    private totalFrames: number = 0;
    private frameWidth: number = 0;
    private frameHeight: number = 0;
    private frameDelay: number = 4;
    private frameCounter: number = 0;

    public isDying: boolean = false;
    public isDead: boolean = false;

    constructor(
        private canvas: HTMLCanvasElement,
        id: string,
    ) {
        this._id = id;
    }

    public get id(): string {
        return this._id;
    }

    public get position(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    public kill(): void {
        const { width, height } = scaleToCanvas(
            this.x,
            this.y,
            this.virtualWidth,
            this.virtualHeight,
            this.canvas,
            this.enemyImage,
        );

        this.deadEffectScale = { width, height };

        this.enemyImage = new Image();
        this.enemyImage.src = 'assets/images/effects/smoke.png';
        this.totalFrames = 8;
        this.isDying = true;
        this.animationFrame = 0;
        this.frameCounter = 0;

        this.enemyImage.onload = () => {
            this.frameWidth = this.enemyImage.width / this.totalFrames;
            this.frameHeight = this.enemyImage.height;
        };
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

        if (this.isDying && this.frameWidth && this.frameHeight) {
            const sx = this.animationFrame * this.frameWidth;
            const offsetY = -height * 0.5;

            ctx.drawImage(
                this.enemyImage,
                sx, 0,
                this.frameWidth, this.frameHeight,
                x, y + offsetY,
                this.deadEffectScale?.width ?? width,
                this.deadEffectScale?.height ?? height
            );
        } else {
            ctx.drawImage(this.enemyImage, x, y, width, height);

            if (this.health < this.maxHealth) {
                this.drawHealthBar(ctx, x, y + height, width);
            }
        }
    }

    private drawHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number): void {
        if (!this.maxHealth) return;

        const barHeight = 4;
        const healthPercentage = this.health / this.maxHealth;

        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(x, y, width, barHeight);

        ctx.fillStyle = healthPercentage > 0.6 ? "green" :
                        healthPercentage > 0.3 ? "yellow" : "red";
        ctx.fillRect(x + 1, y + 1, (width - 2) * healthPercentage, barHeight - 2);
    }

    public update(): void {
        if (this.isDying) {
            this.frameCounter++;
            if (this.frameCounter >= this.frameDelay) {
                this.frameCounter = 0;
                this.animationFrame++;
                if (this.animationFrame >= this.totalFrames) {
                    this.isDead = true;
                }
            }
        } else {
            this.x -= this.speed;
        }
    }
}
