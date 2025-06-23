"use strict";
exports.Lane = void 0;
class Lane {
    constructor(num, x, y) {
        this.num = num;
        this.x = x;
        this.y = y;
        this.players = [];
        this.num = num;
        this.x = x;
        this.y = y;
    }
    addPlayer(player) {
        this.players.push(player);
        this.update();
    }
    removePlayer(player) {
        const index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
        this.update();
    }
    getPlayers() {
        return this.players;
    }
    update() {
        const r = 2.5; // rayon ou demi-longueur de la diagonale/triangle
        switch (this.players.length) {
            case 1:
                this.players[0].x = this.x;
                this.players[0].y = this.y;
                break;
            case 2:
                this.players[0].x = this.x - r;
                this.players[0].y = this.y + r;
                this.players[1].x = this.x + r;
                this.players[1].y = this.y - r;
                break;
            case 3:
                const angle = (Math.PI * 2) / 3; // 120°
                for (let i = 0; i < 3; i++) {
                    const a = angle * i - Math.PI / 3; // -30°, 90°, 210° => base orientée à droite
                    this.players[i].x = this.x + (r + 2) * Math.cos(a); //un rayon plus grand
                    this.players[i].y = this.y + (r + 2) * Math.sin(a);
                }
                break;
            default:
                break;
        }
    }
}
exports.Lane = Lane;
