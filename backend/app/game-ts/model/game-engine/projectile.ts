import { Player } from "./player";

export type ProjectileID = `projectile-${number}`;



export class Projectile {
    public readonly id: ProjectileID;

    public x : number;
    public y : number;
    public width: number;
    public height : number;
    public speed : number;

    public player : Player;
    public markedForDeletion : boolean;

    constructor(player : Player) {
        this.id = `projectile-${Date.now()}`

        this.player = player;
        this.x = player.x + player.width / 2;
        this.y = player.y + player.height / 2;
        this.width = 2.5;
        this.height = 2.5;
        this.speed = 10;
        this.markedForDeletion = false;
    }

    destroy() {
        this.markedForDeletion = true;
    }

    update() {
        if(this.x > 100) this.destroy();
        this.x += this.speed;
    }

    toJSON(): any {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            speed: this.speed,
        };
    }
}