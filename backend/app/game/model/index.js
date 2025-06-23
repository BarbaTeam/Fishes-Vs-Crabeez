const GameEngine = require("./game-engine");

class GameModel {
    
    constructor (sender) {
        this.sender = sender;
        this.gameEngine = new GameEngine(this.sender);
    }

    // TODO : Adding end for game
    runOneFrame() {
        this.gameEngine.update();
    }
}

module.exports = { GameModel };