const { GameLeaderboardTable } = require('../../shared/tables/game-leaderboard.table');



exports.getGameLeaderboards = () => {
    try {
        return GameLeaderboardTable.getAll();
    } catch (err) {
        throw new Error(
            `[GameLeaderboard Manager] Get Error : ${err}`
        );
    }
}

exports.getGameLeaderboardById = (id) => {
    try {
        return GameLeaderboardTable.getByKey({gameId: id});
    } catch (err) {
        throw new Error(
            `[GameLeaderboard Manager] Get Error : ${err}`
        );
    }
}



////////////////////////////////////////////////////////////////////////////////
// DEBUG ::
////////////////////////////////////////////////////////////////////////////////

exports.createGameLeaderboard = (gameLeaderboard) => {
    try {
        GameLeaderboardTable.create({...gameLeaderboard});
        return GameLeaderboardTable.getAll().at(-1);
    } catch (err) {
        throw new Error(
            `[GameLeaderboard Manager] Create Error : ${err}`
        );
    }
}

exports.updateGameLeaderboardById = (id, update) => {
    try {
        return GameLeaderboardTable.updateByKey({gameId: id}, update);
    } catch (err) {
        throw new Error(
            `[GameLeaderboard Manager] Update Error : ${err}`
        );
    }
}

exports.deleteGameLeaderboardById = (id) => {
    try {
        GameLeaderboardTable.deleteByKey({gameId: id});
    } catch (err) {
        throw new Error(
            `[GameLeaderboard Manager] Delete Error : ${err}`
        );
    }
}
