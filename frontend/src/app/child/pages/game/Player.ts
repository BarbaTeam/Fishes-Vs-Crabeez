import { GameEngine } from "./game-engine";
import { GameComponent } from "./game.component";
import { Projectile } from "./Projectile";

export class Player {

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private seat: number;
    private hasChangedSeat: boolean;
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
        this.seat = Math.floor(Math.random() * 3) + 1;;
        this.hasChangedSeat = true;

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
        return this.seat;
    }

    public get projectiles(): Projectile[] {
        return this._projectiles;
    }

    public keydownHandler = (event: KeyboardEvent): void => {
        switch(event.key) {
            case "ArrowLeft":
                this.seat = 1;
                this.hasChangedSeat = true;
                break;
            case "ArrowUp":
                this.seat = 2;
                this.hasChangedSeat = true;
                break;
            case "ArrowRight":
                this.seat = 3;
                this.hasChangedSeat = true;
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
        if(this.hasChangedSeat) {
            switch(this.seat) {
                case 1:
                    this.x = this.canvas.width / 2 - 50 -200;
                    this.y = this.canvas.height - 250 - 50;
                    break;
                case 2:
                    this.x = this.canvas.width / 2 - 50;
                    this.y = this.canvas.height - 300 - 150;
                    break;
                case 3:
                    this.x = this.canvas.width / 2 - 50  +200;
                    this.y = this.canvas.height - 250 - 50;
                    break;
                default:
                    break;
            }
            this.hasChangedSeat = false;
        }
        this.projectiles.forEach(projectile => {
            projectile.update();
        });
        this._projectiles = this.projectiles.filter(projectile => !projectile.isMarkedForDeletion);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const target = this.gameEngine.closestEnemy(this.seat);
        if(target){
            const dx = target.position.x - this.x;
            const dy = target.position.y - this.y;
            this.angle = Math.atan2(dy, dx) + Math.PI / 4; // + 45 degrés car le poisson est incliné de 45 degrés de base
        }
        else {
            this.angle = 0;
        }

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        if (this.angle > Math.PI / 2 || this.angle < -Math.PI / 4) {
            ctx.scale(-1, 1);
            this.angle = -this.angle - Math.PI/2;
        }

        ctx.rotate(this.angle);


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