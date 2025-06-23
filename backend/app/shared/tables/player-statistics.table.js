const { DatabaseTable } = require('./utils/db-table')
const { genPlayerKey } = require('./utils/key-generators');

const { PlayerStatisticsSchema } = require('../schemas/player-statistics.schema');



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
        },
    })
);
