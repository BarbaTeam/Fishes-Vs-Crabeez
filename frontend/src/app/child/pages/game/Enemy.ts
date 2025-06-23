import { GameEngine } from "./game-engine";

export class Enemy {
    protected _id: string;
    protected x: number;
    protected y: number;
    protected lane: number;
    protected width: number;
    protected height: number;
    protected speed!: number;

    constructor(
        private canvas: HTMLCanvasElement,
        id : string,
        lane: number,
        x?: number,
        y?: number,
    ) {
        this._id = id;
        this.lane = lane;
        switch (this.lane) {
            case 1:
                this.x = x ||  this.canvas.width;
                this.y = y ||  (this.canvas.height  + 400) - (this.canvas.height / 4) *2;
                break;
            case 2:
                this.x = x || this.canvas.width;
                this.y = y || (this.canvas.height  + 400) - (this.canvas.height / 4) * 3;
                break;
            case 3:
                this.x = x ||  this.canvas.width;
                this.y = y ||  this.canvas.height  + 400 - (this.canvas.height / 4) * 4;
                break;
            default:
                this.x = 0;
                this.y = 0;
                break
        }
        this.width = 150;
        this.height = 150;
    }
    public get id(): string {
        return this._id;
    }

    public get position(): {x:number, y:number} {
        return {x: this.x, y: this.y};
    }
    
    public update(): void {
        this.x -= this.speed;
    }
}