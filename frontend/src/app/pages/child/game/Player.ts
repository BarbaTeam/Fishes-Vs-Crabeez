import { GameEngine } from "./game-engine";
import { Projectile } from "./Projectile";

export class Player {

    private x: number;
    private y: number;
    private width: number; 
    private height: number; 

    private _projectiles: Projectile[] = [];

    private image: HTMLImageElement;

    constructor(private gameEngine: GameEngine, private canvas: HTMLCanvasElement) {
        this.gameEngine = gameEngine;

        this.x = this.canvas.width / 2 - 50;
        this.y = this.canvas.height - 200 - 50;
        this.width = 200,
        this.height = 200
        this._projectiles = [];

        this.image = new Image();
        this.image.src = "../../../../assets/images/game/player/yellow_fish.png";
    }   
    
    public get position(): {x:number, y:number} {
        return {x: this.x, y: this.y};
    }  

    public get projectiles(): Projectile[] {
        return this._projectiles;
    }

    public shoot(): void {
        this.projectiles.push(new Projectile(this.gameEngine, this.canvas));
    }   

    public update(): void {
        this.projectiles.forEach(projectile => {
            projectile.update();
        });
        this._projectiles = this.projectiles.filter(projectile => !projectile.isMarkedForDeletion);
    }    

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.projectiles.forEach(projectile => {
            projectile.draw(ctx);
        });
    }
}