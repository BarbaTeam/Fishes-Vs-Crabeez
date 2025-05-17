const { PlayerStatisticsTable } = require('../../shared/tables/player-statistics.table');



exports.getPlayersStatistics = () => {
    try {
        return PlayerStatisticsTable.getAll();
    } catch (err) {
        throw new Error(
            `[PlayerStatistics Manager] Get Error : ${err}`
        );
    }
}

exports.getPlayerStatisticsById = (id) => {
    try {
        return PlayerStatisticsTable.getByKey({playerId: id});
    } catch (err) {
        throw new Error(
            `[PlayerStatistics Manager] Get Error : ${err}`
        );
    }
}



////////////////////////////////////////////////////////////////////////////////
// DEBUG ::
////////////////////////////////////////////////////////////////////////////////

exports.createPlayerStatistics = (playerStatistics) => {
    try {
        PlayerStatisticsTable.create({...playerStatistics});
        return PlayerStatisticsTable.getAll().at(-1);
    } catch (err) {
        throw new Error(
            `[PlayerStatistics Manager] Create Error : ${err}`
        );
    }
}

exports.updatePlayerStatisticsById = (id, update) => {
    try {
        return PlayerStatisticsTable.updateByKey({playerId: id}, update);
    } catch (err) {
        throw new Error(
            `[PlayerStatistics Manager] Update Error : ${err}`
        );
    }
}

exports.deletePlayerStatisticsById = (id) => {
    try {
        PlayerStatisticsTable.deleteByKey({playerId: id});
    } catch (err) {
        throw new Error(
            `[PlayerStatistics Manager] Delete Error : ${err}`
        );
    }
}
