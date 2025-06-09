import { Lane } from "./lane";
import { LANES } from "./variables";
import { UserID } from "../../../shared/types";

export class Player {
    public id: UserID;
    public x: number;
    public y: number;
    public lane: Lane;
    public hasChangedLane: boolean = false;
    public score: number = 0;
    public color: "yellow" | "blue" | "red";
    public isParalysed: boolean = false;

    constructor(id: UserID, color: "yellow" | "blue" | "red", lane: Lane) {
        this.id = id;
        this.color = color;
        this.lane = lane;
        this.lane.addPlayer(this);
    }

    private setLane(newLane: Lane) {
        this.lane.removePlayer(this);
        this.lane = newLane;
        this.lane.addPlayer(this);
        this.hasChangedLane = true;
    }

    moveUp() {
        const currentIndex = LANES.findIndex(l => l === this.lane);
        if (currentIndex < LANES.length - 1) {
            this.setLane(LANES[currentIndex + 1]);
        }
    }

    moveDown() {
        const currentIndex = LANES.findIndex(l => l === this.lane);
        if (currentIndex > 0) {
            this.setLane(LANES[currentIndex - 1]);
        }
    }

    toJSON(): any {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            color: this.color,
        };
    }
}
