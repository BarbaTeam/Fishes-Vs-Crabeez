import { GameEngine } from "./game-engine";
import { Player } from "./Player";
import { Projectile } from "./Projectile";

export class Turtle {

    private x: number;
    private y: number;
    private width: number; 
    private height: number; 
    private frontSeats: Player[];
    private middleSeats: Player[];
    private backSeats: Player[];
    private direction: number = 1;

    private image: HTMLImageElement;

    constructor(private gameEngine: GameEngine, private canvas: HTMLCanvasElement) {
        this.gameEngine = gameEngine;

        this.x = this.canvas.width / 2- 100;
        this.y = this.canvas.height - 50;
        this.width = 200;
        this.height = 200;

        this.frontSeats = [];
        this.middleSeats = [];
        this.backSeats = [];

        this.image = new Image();
        this.image.src = "../../../../assets/images/game/player/turtle_64x64.png";
    }   

    public get position(): {x:number, y:number} {
        return {x: this.x, y: this.y};
    }  

    public update(): void {
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y-250, this.width, this.height);
    }
}