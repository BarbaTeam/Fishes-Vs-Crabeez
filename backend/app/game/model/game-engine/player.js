"use strict";
exports.Player = void 0;
const variables_1 = require("./variables");
class Player {
    constructor(id, color, lane) {
        this.hasChangedLane = false;
        this.score = 0;
        this.isParalysed = false;
        this.id = id;
        this.color = color;
        this.lane = lane;
        this.lane.addPlayer(this);
    }
    setLane(newLane) {
        this.lane.removePlayer(this);
        this.lane = newLane;
        this.lane.addPlayer(this);
        this.hasChangedLane = true;
    }
    moveUp() {
        const currentIndex = variables_1.LANES.findIndex(l => l === this.lane);
        if (currentIndex < variables_1.LANES.length - 1) {
            this.setLane(variables_1.LANES[currentIndex + 1]);
        }
    }
    moveDown() {
        const currentIndex = variables_1.LANES.findIndex(l => l === this.lane);
        if (currentIndex > 0) {
            this.setLane(variables_1.LANES[currentIndex - 1]);
        }
    }
    toJSON() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            color: this.color,
        };
    }
}
exports.Player = Player;
