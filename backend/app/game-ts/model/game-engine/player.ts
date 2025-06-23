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

    constructor(lane = 1) {
        this.width = 150;
        this.height = 150;
        this._lane = lane; // 1, 2, 3
        this.hasChangedLane = true;
        this.score = 0;

        this.x = 150;
        this.y = 0;

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

    update(screenHeight = 1080) {
        const laneHeight = screenHeight / 4;

        switch (this.lane) {
            case 1:
                this.y = laneHeight * 2;
                break;
            case 2:
                this.y = laneHeight;
                break;
            case 3:
                this.y = 0;
                break;
        }
    }
}