import { UserID } from "../../../shared/types";

export class Player {
    public id : UserID;

    public x : number;
    public y : number;
    public width : number;
    public height : number;
    private _lane: number;

    public hasChangedLane : boolean;
    public score : number;

    public color: "yellow"|"blue"|"red";

    constructor(id: UserID, color: "yellow"|"blue"|"red", lane = 1) {
        this.id = id;

        this.score = 0;

        this.width = 5;
        this.height = 5;

        this._lane = lane; // 1, 2, 3
        this.color = color;

        this.x = 10;

        this.hasChangedLane = false;

        this.update();
    }

    get lane() {
        return this._lane;
    }

    set lane(value) {
        if (value >= 1 && value <= 3) {
            this._lane = value;
        }
    }

    moveUp() {
        if (this.lane < 3) {
            this.lane++;
            this.hasChangedLane = true;
            this.update();
        }
    }

    moveDown() {
        if (this.lane > 1) {
            this.lane--;
            this.hasChangedLane = true;
            this.update();
        }
    }

    update() {
        switch (this.lane) { //espacements de 25px entre les lanes
            case 1:
                this.y = 49;
                break;
            case 2:
                this.y = 33;
                break;
            case 3:
                this.y = 17;
                break;
        }
    }

    toJSON(): any {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            lane: this.lane,
            color: this.color,
        };
    }
}
