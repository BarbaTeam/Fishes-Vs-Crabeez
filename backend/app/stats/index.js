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

    const gameId = gameLog.gameId;
    const playersId = gameLog.info.playersId;
    const nbPlayers = playersId.length;


    GameInfoTable.insert({
        gameId: gameLog.gameId,
        ...gameLog.info,
    });

    console.log(gameLog);

    // Step 1 : Generating player's results for all players :
    for (let i=0; i<nbPlayers; i++) {
        PlayerResultsTable.insert({
            playerId: playersId[i],
            gameId: gameId,
            results: {
                score: gameLog.score,
                kills: gameLog.playersKills[i],
                ...processPlayerAnswers(gameLog.playersAnswers[i], gameLog.info.duration),
            },
            answersShown: UserTable.getByKey({userId: playersId[i]}).config.showsAnswer,
        });

        console.log(`[STATS PROCESSOR] New PlayerResults inserted`);
    }

    // Step 2 : Updating player's statistics of all players :
    for (let i=0; i<nbPlayers; i++) {
        const playerHistory = PlayerResultsTable.getWhere(pr => pr.playerId === playersId[i])
            .reverse()
            .slice(0, LIMIT);

        if (PlayerStatisticsTable.existsByKey({playerId: playersId[i]})) {
            const oldPlayerStatistics = PlayerStatisticsTable.getByKey({playerId: playersId[i]});
            const latestPlayerResults = playerHistory[0];

            const enemiesKind = Object.keys(oldPlayerStatistics.statistics.globalKills);

            const newGlobalKills = oldPlayerStatistics.statistics.globalKills;
            for (let enemyKind of enemiesKind) {
                newGlobalKills[enemyKind] += latestPlayerResults.results.kills[enemyKind];
            }

            console.log(oldPlayerStatistics.statistics.globalScore);
            console.log(latestPlayerResults.results.score);
            const newGlobalScore = oldPlayerStatistics.statistics.globalScore + latestPlayerResults.results.score;

            console.log("Global Score :");
            console.log(newGlobalScore);

            console.log("Global Kills :");
            console.log(newGlobalKills);

            PlayerStatisticsTable.updateByKey({playerId: playersId[i]}, {
                statistics: {
                    globalScore: newGlobalScore,
                    globalKills: newGlobalKills,
                    ...genStatisticsFromHistory(playerHistory)
                },
            });
        } else {
            PlayerStatisticsTable.insert({
                playerId: playersId[i],
                statistics: genStatisticsFromHistory(playerHistory),
            });
        }

        console.log(`[STATS PROCESSOR] New PlayerStatistics inserted`);
    }
}
