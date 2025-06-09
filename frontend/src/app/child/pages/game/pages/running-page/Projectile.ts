import { Player } from "./Player";
import { scaleToCanvas } from "./utils";

export class Projectile {
    private _id: string;

    private virtualX!: number;
    private virtualY!: number;
    private virtualWidth: number;
    private virtualHeight: number;

    private image: HTMLImageElement;

    constructor(private canvas: HTMLCanvasElement, private player: Player, id: string) {
        this._id = id;

        this.virtualWidth = 2.5;
        this.virtualHeight = 2.5;

        this.image = new Image();
        this.image.src = "../../../../assets/images/game/projectile/bubble.png";
    }

    public static fromJSON(data: any, canvas: HTMLCanvasElement, player: Player): Projectile {
        const projectile = new Projectile(canvas, player, data.id);
        projectile.virtualX = data.x;
        projectile.virtualY = data.y;
        return projectile;
    }

    public get id(): string {
        return this._id;
    }

    public update(): void {
        this.virtualX += 5;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const { x, y, width, height } = scaleToCanvas(
            this.virtualX,
            this.virtualY,
            this.virtualWidth,
            this.virtualHeight,
            this.canvas,
        );

        ctx.drawImage(this.image, x, y, width, height);
    }
}
