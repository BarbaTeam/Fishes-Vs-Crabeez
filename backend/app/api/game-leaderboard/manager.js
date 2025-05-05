const GameLeaderboard = require('../../models/game-leaderboard.model');

exports.getGameLeaderboards = () => {
    try {
        return GameLeaderboard.get();
    } catch (err) {
        throw new Error(
            `Manager : failed to retrive gameLeaderboards.\n
            Caught : ${err}`
        );
    }
}

exports.getGameLeaderboardById = (id) => {
    try {
        return GameLeaderboard.getById(id);
    } catch (err) {
        throw new Error(
            `Manager : failed to retrive gameLeaderboard with Id : ${id}.\n
            Caught : ${err}`
        );
    }
}

exports.createGameLeaderboard = (gameLeaderboard) => {
    try {
        return GameLeaderboard.create({...gameLeaderboard});
    } catch (err) {
        throw new Error(
            `Manager : failed to create gameLeaderboard.\n
            Caught : ${err}`
        );
    }
}

exports.updateGameLeaderboard = (id, gameLeaderboard) => {
    try {
        return GameLeaderboard.update(id, gameLeaderboard);
    } catch (err) {
        throw new Error(
            `Manager : failed to update gameLeaderboard.\n
            Caught : ${err}`
        );
    }
}

exports.deleteGameLeaderboard = (id, gameLeaderboard) => {
    try {
        return GameLeaderboard.delete(id, gameLeaderboard);
    } catch (err) {
        throw new Error(
            `Manager : failed to delete gameLeaderboard.\n
            Caught : ${err}`
        );
    }
}

