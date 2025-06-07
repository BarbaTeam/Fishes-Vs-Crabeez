export type EnemyID = `ennemy-${number}`;


export class Enemy {
    public readonly id: EnemyID;

    public health: number;
    public lane : 1 | 2 | 3;
    public x : number;
    public y : number;
    public width : number;
    public height : number;
    public alive : boolean;
    public speed : number;
    public score : number;

    constructor(health: number, lane? : 1|2|3, x? : number, y? : number) {
        this.id = `ennemy-${Date.now()}`;

        this.lane = lane !== undefined ? lane : Math.floor(Math.random() * 3) + 1 as  1 | 2 | 3;
        this.x = x !== undefined ? x : 1000;

        this.y = this._setInitialPosition(y);

        this.width = 150;
        this.height = 150;
        this.alive = true;
        this.speed = 0.2;
        this.score = 10;
    }

    private _setInitialPosition(providedY : number | undefined) {
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

    public destroy() {
        this.alive = false;
    }

    public update() {
        if (this.x > 100) {
            this.x -= this.speed;
        } else {
            this.alive = false;
        }
    }

    toJSON(): any {
        return {
            lane  : this.lane,
            x     : this.x,
            y     : this.y,
            width : this.width,
            height: this.height,
            alive : this.alive,
            health: this.health,
            speed : this.speed,
        };
    }
}