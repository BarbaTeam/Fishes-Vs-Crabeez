import { GameEngine } from "./game-engine";

export class Enemy {

    protected x: number;
    protected y: number;
    protected side: number;
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
        side?: number
    ) {
        this.gameEngine = gameEngine;
        if(!side){
            this.side = Math.floor(Math.random() * 3) + 1;
        } else {
            this.side = side;
        }
        switch (this.side) {
            case 1:
                this.x = x || 0;
                this.y = y ||  this.canvas.height - 50;
                break;
            case 2:
                this.x = x || this.canvas.width * Math.random();
                this.y = y || 0;
                break;
            case 3:
                this.x = x ||  this.canvas.width;
                this.y = y ||  this.canvas.height -50;
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
        return this.side;
    }

    public destroy(): void {
        this.alive = false;
    }

    public update(): void {
        const dx = this.gameEngine.turtlePosition.x - this.x;
        const dy = this.gameEngine.turtlePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            this.x += moveX;
            this.y += moveY;
        }

        if (distance < 100) {
            this.alive = false;
        }
    }
}