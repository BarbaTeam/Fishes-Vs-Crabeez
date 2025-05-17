const { PlayerResultsTable } = require('../../shared/tables/player-results.table');



exports.getPlayersResults = () => {
    try {
        return PlayerResultsTable.getAll();
    } catch (err) {
        throw new Error(
            `[PlayerResults Manager] Get Error : ${err}`
        );
    }
}

exports.getPlayerResultsList = (playerId, limit) => {
    try {
        return PlayerResultsTable.getWhere((pr) => pr.playerId === playerId)
            .reverse()
            .slice(0, limit);
    } catch (err) {
        throw new Error(
            `[PlayerResults Manager] Get Error : ${err}`
        );
    }
}

exports.getPlayerResultsByIds = (playerId, gameId) => {
    try {
        return PlayerResultsTable.getByKey({playerId: playerId, gameId: gameId});
    } catch (err) {
        throw new Error(
            `[PlayerResults Manager] Get Error : ${err}`
        );
    }
}



////////////////////////////////////////////////////////////////////////////////
// DEBUG ::
////////////////////////////////////////////////////////////////////////////////

exports.insertPlayerResults = (insertion) => {
    try {
        PlayerResultsTable.insert({ ...insertion });
        return PlayerResultsTable.getAll().at(-1);
    } catch (err) {
        throw new Error(
            `[PlayerResults Manager] Insert Error : ${err}`
        );
    }
}

exports.updatePlayerResultsByIds = (playerId, gameId, update) => {
    try {
        return PlayerResultsTable.updateByKey({playerId: playerId, gameId: gameId}, update);
    } catch (err) {
        throw new Error(
            `[PlayerResults Manager] Update Error : ${err}`
        );
    }
}

exports.deletePlayerResultsList = (playerId) => {
    try {
        PlayerResultsTable.deleteWhere((pr) => pr.playerId === playerId);
    } catch (err) {
        throw new Error(
            `[PlayerResults Manager] Delete Error : ${err}`
        );
    }
}


exports.deletePlayerResultsByIds = (playerId, gameId) => {
    try {
        PlayerResultsTable.deleteByKey({playerId: playerId, gameId: gameId});
    } catch (err) {
        throw new Error(
            `[PlayerResults Manager] Delete Error : ${err}`
        );
    }
}
