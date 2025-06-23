const { GameInfoTable } = require('../../shared/tables/game-info.table');



exports.getGameInfos = () => {
    try {
        return GameInfoTable.getAll();
    } catch (err) {
        throw new Error(
            `[GameInfo Manager] Get Error : ${err}`
        );
    }
}

exports.getGameInfoById = (id) => {
    try {
        return GameInfoTable.getByKey({gameId: id});
    } catch (err) {
        throw new Error(
            `[GameInfo Manager] Get Error : ${err}`
        );
    }
}



////////////////////////////////////////////////////////////////////////////////
// DEBUG ::
////////////////////////////////////////////////////////////////////////////////

exports.insertGameInfo = (gameInfo) => {
    try {
        GameInfoTable.insert({...gameInfo});
        return GameInfoTable.getAll().at(-1);
    } catch (err) {
        throw new Error(
            `[GameInfo Manager] Create Error : ${err}`
        );
    }
}

exports.updateGameInfoById = (id, update) => {
    try {
        return GameInfoTable.updateByKey({gameId: id}, update);
    } catch (err) {
        throw new Error(
            `[GameInfo Manager] Update Error : ${err}`
        );
    }
}

exports.deleteGameInfoById = (id) => {
    try {
        GameInfoTable.deleteByKey({gameId: id});
    } catch (err) {
        throw new Error(
            `[GameInfo Manager] Delete Error : ${err}`
        );
    }
}
