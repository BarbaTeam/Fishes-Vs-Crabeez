import { GameEngine } from "./game-engine";
import { GameComponent } from "./game.component";
import { Projectile } from "./Projectile";

export class Player {

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private lane: number;
    private hasChangedLane: boolean;
    private angle: number = 0;
    private _projectiles: Projectile[] = [];

    private decryptedImage: HTMLImageElement;
    private encryptedImage: HTMLImageElement;

    constructor(
        private gameEngine: GameEngine,
        private canvas: HTMLCanvasElement
    ) {
        this.gameEngine = gameEngine;

        this.x = this.canvas.width / 2 - 50;
        this.y = this.canvas.height - 200 - 50;
        this.width = 100;
        this.height = 100;
        this._projectiles = [];
        this.lane = Math.floor(Math.random() * 3) + 1;;
        this.hasChangedLane = true;

        this.decryptedImage = new Image();
        this.decryptedImage.src = "../../../../assets/images/game/player/yellow_fish.png";

        this.encryptedImage = new Image();
        this.encryptedImage.src = "../../../../assets/images/game/player/yellow_fish_encrypted.png";

        document.addEventListener("keydown", this.keydownHandler);
    }

    public get position(): {x:number, y:number} {
        return {x: this.x, y: this.y};
    }

    public get seatValue(): number {
        return this.lane;
    }

    public get projectiles(): Projectile[] {
        return this._projectiles;
    }

    public keydownHandler = (event: KeyboardEvent): void => {
        switch(event.key) {
            case "ArrowUp":
                if(this.lane < 3)
                    this.lane ++;
                    this.hasChangedLane = true;
                break;
            case "ArrowDown":
                if(this.lane > 1)
                    this.lane --;
                    this.hasChangedLane = true;
                break;
            default:
                break;
        }
    }


    public shoot(): void {
        if(this.gameEngine.questionNotion !== "ENCRYPTION")
            this.projectiles.push(new Projectile(this.gameEngine, this));
    }

    public update(): void {
        if(this.hasChangedLane) {
            switch(this.lane) {
                case 1:
                    this.x = 100;
                    this.y = (this.canvas.height + 300) - (this.canvas.height / 4) *2;
                    break;
                case 2:
                    this.x = 100;
                    this.y = (this.canvas.height  + 300) - (this.canvas.height / 4) *3;
                    break;
                case 3:
                    this.x = 100;
                    this.y = (this.canvas.height  + 300) - (this.canvas.height / 4) *4;
                    break;
                default:
                    break;
            }
             
            this.hasChangedLane = false;
        }
        this.projectiles.forEach(projectile => {
            projectile.update();
        });
        this._projectiles = this.projectiles.filter(projectile => !projectile.isMarkedForDeletion);
    }

    public draw(ctx: CanvasRenderingContext2D): void {

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        ctx.rotate(Math.PI/4);


        if (this.gameEngine.questionNotion == "ENCRYPTION"){
            ctx.drawImage(this.encryptedImage, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.drawImage(this.decryptedImage, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        ctx.restore();

        this.projectiles.forEach(projectile => {
            projectile.draw(ctx);
        });
    }
}