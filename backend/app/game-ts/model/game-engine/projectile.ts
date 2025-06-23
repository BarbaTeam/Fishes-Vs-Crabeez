import { Player } from "./player";
import { VIRTUAL_WIDTH } from "./variables";

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
        this.x = player.x;
        this.y = player.y;
        this.width = 5;
        this.height = 5;
        this.speed = 5;
        this.markedForDeletion = false;
    }

    destroy() {
        this.markedForDeletion = true;
    }

    update() {
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
            playerId: this.player.id,
        };
    }
}