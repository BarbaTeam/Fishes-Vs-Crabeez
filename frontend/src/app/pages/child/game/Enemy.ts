import { GameEngine } from "./game-engine";

export class Enemy {
     
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number; 
    protected alive: boolean;
    protected speed: number;
    protected score: number;

    constructor(private gameEngine: GameEngine, private canvas: HTMLCanvasElement, x?: number, y?: number) {
        this.gameEngine = gameEngine;

        this.x = x || this.canvas.width * Math.random();
        this.y = y || 300;
        this.width = 100,
        this.height = 100
        this.alive = true;
        this.speed = 0.5; 
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

    public destroy(): void {
        this.alive = false;
    }
    
    public update(): void {
        const dx = this.gameEngine.playerPosition.x - this.x;
        const dy = this.gameEngine.playerPosition.y - this.y;
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