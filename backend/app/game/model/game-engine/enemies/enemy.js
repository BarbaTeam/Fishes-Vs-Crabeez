class Enemy {
    constructor(x, lane, y) {
        this.lane = lane !== undefined ? lane : Math.floor(Math.random() * 3) + 1;
        this.x = x !== undefined ? x : 1000;

        this.y = this._setInitialPosition(y);

        this.width = 150;
        this.height = 150;
        this.alive = true;
        this.speed = 0.2;
        this.score = 10;
    }

    _setInitialPosition(providedY) {
        if (providedY !== undefined) return providedY;

        switch (this.lane) {
            case 1:
                return 400;
            case 2:
                return 300;
            case 3:
                return 200;
            default:
                return 400;
        }
    }

    destroy() {
        this.alive = false;
    }

    update() {
        if (this.x > 100) {
            this.x -= this.speed;
        } else {
            this.alive = false;
        }
    }
}



module.exports = { Enemy };
