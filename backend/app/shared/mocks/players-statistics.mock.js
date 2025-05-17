const { PlayerStatisticsTable } = require('../tables/player-statistics.table');



// TODO : Defining true mocks
const MOCK_PLAYER_STATISTICS_PLACEHOLDERS = [
    {
        playerId: "u1",
        statistics: {
            wordsPerMinute: 2.466666666666667,
            wordsPerMinuteImprovement: -0.066666666666667,
            globalGrading: { grade: "A", accuracy: 80 },
            globalAccuracyImprovement: 0,
            gradingPerNotion: {
                ADDITION      : { grade: "A" , accuracy: 70 },
                SUBSTRACTION  : { grade: "B+" , accuracy: 60 },
                MULTIPLICATION: { grade: "A+" , accuracy: 90 },
                DIVISION      : { grade: "A+", accuracy: 100 },
                EQUATION      : { grade: "XF", accuracy: 0 },
                REWRITING     : { grade: "A", accuracy: 80 },
                ENCRYPTION    : { grade: "C+" , accuracy: 30 },
            },
            accuracyImprovementPerNotion: {
                ADDITION:       0,
                SUBSTRACTION:   0,
                MULTIPLICATION: 5,
                DIVISION:       0,
                REWRITING:      -6,
                ENCRYPTION:     0,
                EQUATION:       7,
            },

            mostCommonMistakes: {
                spelling   : [],
                calculation: [],
            },
            mostRecentMistakes: {
                spelling   : [],
                calculation: [],
            },
        },
    },

    {
        playerId: "u2",
        statistics: {
            wordsPerMinute: 3.7666666666666666,
            wordsPerMinuteImprovement: -1.366666666666667,

            globalGrading: { grade: "F", accuracy: 0 },
            globalAccuracyImprovement: 0,
            gradingPerNotion: {
                ADDITION:       { grade: "XF", accuracy: 0 },
                SUBSTRACTION:   { grade: "XF", accuracy: 0 },
                MULTIPLICATION: { grade: "XF", accuracy: 0 },
                DIVISION:       { grade: "XF", accuracy: 0 },
                REWRITING:      { grade: "A", accuracy: 0 },
                ENCRYPTION:     { grade: "XF", accuracy: 0 },
                EQUATION:       { grade: "XF", accuracy: 0 },
            },
            accuracyImprovementPerNotion: {
                ADDITION:       0,
                SUBSTRACTION:   0,
                MULTIPLICATION: 0,
                DIVISION:       0,
                REWRITING:      0,
                ENCRYPTION:     0,
                EQUATION:       0,
            },

            mostCommonMistakes: {
                spelling   : [],
                calculation: [],
            },
            mostRecentMistakes: {
                spelling   : [],
                calculation: [],
            },
        },
    },

    {
        playerId: "u3",
        statistics: {
            wordsPerMinute: 4,
            wordsPerMinuteImprovement: +2,
            globalGrading: { grade: "XF", accuracy: 0 },
            globalAccuracyImprovement: 0,
            gradingPerNotion: {
                ADDITION:       { grade: "XF", accuracy: 0 },
                SUBSTRACTION:   { grade: "XF", accuracy: 0 },
                MULTIPLICATION: { grade: "XF", accuracy: 0 },
                DIVISION:       { grade: "XF", accuracy: 0 },
                REWRITING:      { grade: "XF", accuracy: 0 },
                ENCRYPTION:     { grade: "XF", accuracy: 0 },
                EQUATION:       { grade: "XF", accuracy: 0 },
            },
            accuracyImprovementPerNotion: {
                ADDITION:       0,
                SUBSTRACTION:   0,
                MULTIPLICATION: 0,
                DIVISION:       0,
                REWRITING:      0,
                ENCRYPTION:     0,
                EQUATION:       0,
            },

            mostCommonMistakes: {
                spelling   : [],
                calculation: [],
            },
            mostRecentMistakes: {
                spelling   : [],
                calculation: [],
            },
        },
    },

    {
        playerId: "u4",
        statistics: {
            wordsPerMinute: 3,
            wordsPerMinuteImprovement: 0,
            globalGrading: { grade: "XF", accuracy: 0 },
            globalAccuracyImprovement: 0,
            gradingPerNotion: {
                ADDITION:       { grade: "XF", accuracy: 0 },
                SUBSTRACTION:   { grade: "XF", accuracy: 0 },
                MULTIPLICATION: { grade: "XF", accuracy: 0 },
                DIVISION:       { grade: "XF", accuracy: 0 },
                REWRITING:      { grade: "XF", accuracy: 0 },
                ENCRYPTION:     { grade: "XF", accuracy: 0 },
                EQUATION:       { grade: "XF", accuracy: 0 },
            },
            accuracyImprovementPerNotion: {
                ADDITION:       0,
                SUBSTRACTION:   0,
                MULTIPLICATION: 0,
                DIVISION:       0,
                REWRITING:      0,
                ENCRYPTION:     0,
                EQUATION:       0,
            },

            mostCommonMistakes: {
                spelling   : [],
                calculation: [],
            },
            mostRecentMistakes: {
                spelling   : [],
                calculation: [],
            },
        },
    },
];



exports.populatePlayerStatisticsTable = () => {
    PlayerStatisticsTable.reset();
    for (let playerStatistics of MOCK_PLAYER_STATISTICS_PLACEHOLDERS) {
        PlayerStatisticsTable.insert(playerStatistics);
    }
}