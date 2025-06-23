class Projectile {
    constructor(player) {
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
        this.x += this.speed;
    }
}

module.exports = Projectile;
