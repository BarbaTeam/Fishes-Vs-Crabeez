const { UserTable } = require('../shared/tables/user.table');
const { PlayerResultsTable } = require('../shared/tables/player-results.table');
const { PlayerStatisticsTable } = require('../shared/tables/player-statistics.table');

const { processPlayerAnswers } = require('./player-results-builder');
const { genStatisticsFromHistory } = require('./player-statistics-generator');

// Types :
const { GameLog } = require('../shared/types');



/**
 * @param {GameLog} gameLog
 */
exports.processGameLog = (gameLog) => {
    const nbPlayers = gameLog.infos.playerIds.length

    const gameId = gameLog.gameId;
    const playerIds = gameLog.infos.playerIds;

    // Step 1 : Generating player's results for all players :
    for (let i=0; i<nbPlayers; i++) {
        PlayerResultsTable.insert({
            playerId: playerId,
            gameId: gameId,
            results: processPlayerAnswers(gameLog.playerAnswers[i], gameLog.info.duration),
            answersShown: UserTable.getByKey({userId: playerIds[i]}).userConfig.showsAnswer,
        });
    }

    // Step 2 : Updating player's statistics of all players :
    for (let i=0; i<nbPlayers; i++) {
        const playerHistory = PlayerResultsTable.getWhere(pr => pr.playerId === playerIds[i])
            .reverse()
            .slice(0, limit);

        if (PlayerStatisticsTable.existsByKey({playerId: playerIds[i]})) {
            PlayerStatisticsTable.updateByKey({playerId: playerIds[i]}, {
                statistics: genStatisticsFromHistory(playerHistory),
            });
        } else {
            PlayerStatisticsTable.insert({
                playerId: playerIds[i],
                statistics: genStatisticsFromHistory(playerHistory),
            });
        }
    }
}
