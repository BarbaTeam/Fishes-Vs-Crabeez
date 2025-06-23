import { GameEngine } from "./game-engine";

export class Enemy {

    protected x: number;
    protected y: number;
    protected lane: number;
    protected width: number;
    protected height: number;
    protected alive: boolean;
    protected speed: number;
    protected score: number;

    constructor(
        private gameEngine: GameEngine,
        private canvas: HTMLCanvasElement,
        x?: number,
        y?: number,
        lane?: number
    ) {
        this.gameEngine = gameEngine;
        if(!lane){
            this.lane = Math.floor(Math.random() * 3) + 1;
        } else {
            this.lane = lane;
        }
        switch (this.lane) {
            case 1:
                this.x = x ||  this.canvas.width;
                this.y = y ||  (this.canvas.height  + 300) - (this.canvas.height / 4) *2;
                break;
            case 2:
                this.x = x || this.canvas.width;
                this.y = y || (this.canvas.height  + 300) - (this.canvas.height / 4) * 3;
                break;
            case 3:
                this.x = x ||  this.canvas.width;
                this.y = y ||  this.canvas.height  + 300 - (this.canvas.height / 4) * 4;
                break;
            default:
                this.x = 0;
                this.y = 0;
                break
        }
        this.width = 100,
        this.height = 100
        this.alive = true;
        this.speed = 0.2;
        this.score = 10;

    }

    public get position(): {x:number, y:number} {
        return {x: this.x, y: this.y};
    }
    public get isAlive(): boolean {
        return this.alive;
    }
    public get scoreValue(): number {
        return this.score;
    }
    public get sideValue(): number {
        return this.lane;
    }

    public destroy(): void {
        this.alive = false;
    }

    public update(): void {

        if (this.x > 100) {
            const moveX = 1 * this.speed;
            this.x -= moveX;
        }
        else {
            this.alive = false;
        }
    }
}