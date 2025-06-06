const Enemy = require("./enemy");

class Crab extends Enemy {
    constructor(x, y, lane) {
        super(x, lane, y);
    }
}

module.exports = Crab;