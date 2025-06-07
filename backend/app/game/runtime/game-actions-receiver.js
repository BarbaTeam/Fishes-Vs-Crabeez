const { AnsweredQuestion, GameID, UserID } = require('../../shared/types');



class GameActionsReceiver {
    /**
     * @param {GameID} gameId
     * @param {GameModel} model
     */
    constructor (gameId, model) {
        this.gameId = gameId;
        this.model = model;
    }


    /**
     * @param {UserID} playerId
     */
    onShoot(playerId) {
        this.model.handleShoot(playerId)
    }

    /**
     * @param {UserID} playerId
     * @param {AnsweredQuestion} answer
     */
    onAnswerReceived(playerId, answer) {}

    /**
     * @param {UserID} playerId
     * @param {"UP"|"DOWN"} change
     */
    onLanesChange(playerId, change) {}

    /**
     * @param {UserID} playerId
     */
    onPlayerLeaving(playerId) {}
}



module.exports = { GameActionsReceiver };
