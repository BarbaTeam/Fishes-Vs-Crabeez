import { EnemyKind } from "@app/shared/models/enemy-kind.model";
import { scaleToCanvas } from "../utils";
import { SpriteSheetAnimation } from "../SpriteSheetAnimation";

export class Enemy {
    public id: string;
    public type!: EnemyKind;
    public x!: number;
    public y!: number;
    public virtualWidth!: number;
    public virtualHeight!: number;

    public enemyHitUrl?: string;
    public enemyUrl!: string;
    public totalFrames!: number;
    public frameDelay!: number;

    public speed!: number;
    public health!: number;
    public maxHealth!: number;

    public animation?: SpriteSheetAnimation;

    public isDying: boolean = false;
    public isDead: boolean = false;

    constructor(
        private canvas: HTMLCanvasElement,
        id: string,
    ) {
        this.id = id;
        setTimeout(() => {
            this.setAnimation(this.enemyUrl);
        }, Math.random() * 2000); 
    }

    public setAnimation(imageUrl: string) {
        this._setAnimation(imageUrl, this.totalFrames, this.frameDelay);
    }

    protected _setAnimation(imageUrl: string, totalFrames: number, frameDelay: number) {
        const img = new Image();
        img.src = imageUrl;
        this.animation = new SpriteSheetAnimation(img, totalFrames, frameDelay);
    }

    public kill(): void {
        this.isDying = true;
        this._setAnimation('assets/images/effects/smoke.png', 8, 1)
        this.animation?.reset();
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const { x, y, width, height } = scaleToCanvas(
            this.x,
            this.y,
            this.virtualWidth,
            this.virtualHeight,
            this.canvas,
            undefined,
        );

        this.animation?.draw(ctx, x, y, width, height);

        if (this.health < this.maxHealth) {
            this.drawHealthBar(ctx, x, y + height, width);
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
        if (this.isDying && this.animation) {
            this.animation.update();
            if (this.animation.isFinished()) {
                this.isDead = true;
            }
        } else {
            this.x -= this.speed;
            this.animation?.update();
        }
    }
}
