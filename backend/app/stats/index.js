const { UserTable } = require('../shared/tables/user.table');
const { GameInfoTable } = require('../shared/tables/game-info.table');
const { PlayerResultsTable } = require('../shared/tables/player-results.table');
const { PlayerStatisticsTable } = require('../shared/tables/player-statistics.table');

const { processPlayerAnswers } = require('./player-results-builder');
const { genStatisticsFromHistory } = require('./player-statistics-generator');

// Types :
const { GameLog } = require('../shared/types');



const LIMIT = 5; // Number of results with coeff non null used to compute a statistic



/**
 * @param {GameLog} gameLog
 */
exports.processGameLog = (gameLog) => {
    console.log(`Processing statistics for game ${gameLog.gameId}`);

    const nbPlayers = gameLog.info.playersId.length

    const gameId = gameLog.gameId;
    const playersId = gameLog.info.playersId;

    GameInfoTable.insert({
        gameId: gameLog.gameId,
        ...gameLog.info,
    });

    // Step 1 : Generating player's results for all players :
    for (let i=0; i<nbPlayers; i++) {
        PlayerResultsTable.insert({
            playerId: playersId[i],
            gameId: gameId,
            results: processPlayerAnswers(gameLog.playersAnswers[i], gameLog.info.duration),
            answersShown: UserTable.getByKey({userId: playersId[i]}).config.showsAnswer,
        });
    }

    // Step 2 : Updating player's statistics of all players :
    for (let i=0; i<nbPlayers; i++) {
        const playerHistory = PlayerResultsTable.getWhere(pr => pr.playerId === playersId[i])
            .reverse()
            .slice(0, LIMIT);

        if (PlayerStatisticsTable.existsByKey({playerId: playersId[i]})) {
            PlayerStatisticsTable.updateByKey({playerId: playersId[i]}, {
                statistics: genStatisticsFromHistory(playerHistory),
            });
        } else {
            PlayerStatisticsTable.insert({
                playerId: playersId[i],
                statistics: genStatisticsFromHistory(playerHistory),
            });
        }
    }
}
