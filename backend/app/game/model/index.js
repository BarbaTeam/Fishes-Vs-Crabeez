const GameEngine = require("./game-engine");



class GameModel {
    constructor (notifier) {
        this.gameEngine = new GameEngine(notifier);

        this.qGenerator = new QuestionGenerator();
        this.ansChecker;
    }

    // TODO : Adding end for game
    runOneFrame() {
        this.gameEngine.update();
    }
}



module.exports = { GameModel };