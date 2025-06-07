import { GameEngine } from "./game-engine";
import { Player } from "./Player";

export class Projectile {
    private _id: string;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private image: HTMLImageElement;

    constructor(
        private player: Player,
        id: string,
    ) {
        this._id = id;
        this.player = player;
        this.x = this.player.position.x;
        this.y = this.player.position.y;
        this.width = 50;
        this.height = 50;

        this.image = new Image();
        this.image.src = "../../../../assets/images/game/projectile/bubble.png";
    }

    public static fromJson(data: any, player: Player): Projectile {
        const projectile = new Projectile(player, data.id);
        projectile.x = data.x;
        projectile.y = data.y;
        return projectile;
    }

    public get id(): string {
        return this._id;
    }

    public update() : void {
        this.x += 10;
    }
    
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}