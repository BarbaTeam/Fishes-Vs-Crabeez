import { Player } from "./player";

export class Projectile {
    public player : Player;
    public x : number;
    public y : number;
    public width: number;
    public height : number;
    public speed : number;
    public markedForDeletion : boolean;

    constructor(player : Player) {
        this.player = player;
        this.x = player.x + player.width;
        this.y = player.y + player.height / 2 - 25;
        this.width = 50;
        this.height = 50;
        this.speed = 10;
        this.markedForDeletion = false;
    }

    destroy() {
        this.markedForDeletion = true;
    }

    update() {
        if(this.x > 3000) this.destroy();
        this.x += this.speed;
    }
}