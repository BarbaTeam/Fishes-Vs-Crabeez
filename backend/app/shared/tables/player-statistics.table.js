const { PlayerStatistics } = require('../types');
const { PlayerStatisticsSchema } = require('../schemas/player-statistics.schema');

const { DatabaseTable } = require('./utils/db-table')
const { genPlayerKey } = require('./utils/key-generators');



/**
 * @type {DatabaseTable<PlayerStatistics>}
 */
exports.PlayerStatisticsTable = new DatabaseTable(
    "PlayerStatistics",
    PlayerStatisticsSchema,
    ["playerId"],
    genPlayerKey,
    () => ({
        statistics: {
            wordsPerMinute: 0,
            wordsPerMinuteImprovement: 0,

            globalGrading: {grade: "XF", accuracy: 0},
            globalAccuracyImprovement: 0,

            gradingPerNotion: {
                ADDITION      : {grade: "XF", accuracy: 0},
                SUBSTRACTION  : {grade: "XF", accuracy: 0},
                MULTIPLICATION: {grade: "XF", accuracy: 0},
                DIVISION      : {grade: "XF", accuracy: 0},
                EQUATION      : {grade: "XF", accuracy: 0},
                REWRITING     : {grade: "XF", accuracy: 0},
                ENCRYPTION    : {grade: "XF", accuracy: 0},
            },
            accuracyImprovementPerNotion: {
                ADDITION      : 0,
                SUBSTRACTION  : 0,
                MULTIPLICATION: 0,
                DIVISION      : 0,
                EQUATION      : 0,
                REWRITING     : 0,
                ENCRYPTION    : 0,
            },

            mostCommonMistakes: {
                spelling: [],
                calculation: [],
            },
            mostRecentMistakes: {
                spelling: [],
                calculation: [],
            },

            globalScore: 0,

            globalKills: {
                CRAB: 0,
                HIVECRAB: 0,
                DRONE: 0,
                PAPA: 0,
            }
        },
    })
);
