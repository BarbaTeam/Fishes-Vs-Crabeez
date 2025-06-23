import { PlayerStatistics } from "../models/player-results.model"
import { Grade } from "../models/results.model"

// TODO : Defining true mocks
export const MOCK_PLAYER_STATISTICS_PLACEHOLDERS: PlayerStatistics[] = [
    {
        playerId: "u1",
        statistics: {
            wordsPerMinute: 2.466666666666667,
            wordsPerMinuteImprovement: -0.066666666666667,
            globalGrading: { grade: Grade.F, accuracy: 0 },
            globalAccuracyImprovement: 0,
            gradingPerNotion: {
                ADDITION:       { grade: Grade.XF, accuracy: 0 },
                SUBSTRACTION:   { grade: Grade.XF, accuracy: 0 },
                MULTIPLICATION: { grade: Grade.F, accuracy: 0 },
                DIVISION:       { grade: Grade.XF, accuracy: 0 },
                REWRITING:      { grade: Grade.F, accuracy: 0 },
                ENCRYPTION:     { grade: Grade.XF, accuracy: 0 },
                EQUATION:       { grade: Grade.F, accuracy: 0 },
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
                spelling: [],
                calculation: [],
            },
            mostRecentMistakes: {
                spelling: [],
                calculation: [],
            },
        },
    },

    {
        playerId: "u2",
        statistics: {
            wordsPerMinute: 3.7666666666666666,
            wordsPerMinuteImprovement: -1.366666666666667,

            globalGrading: { grade: Grade.F, accuracy: 0 },
            globalAccuracyImprovement: 0,
            gradingPerNotion: {
                ADDITION:       { grade: Grade.XF, accuracy: 0 },
                SUBSTRACTION:   { grade: Grade.XF, accuracy: 0 },
                MULTIPLICATION: { grade: Grade.XF, accuracy: 0 },
                DIVISION:       { grade: Grade.XF, accuracy: 0 },
                REWRITING:      { grade: Grade.XF, accuracy: 0 },
                ENCRYPTION:     { grade: Grade.XF, accuracy: 0 },
                EQUATION:       { grade: Grade.XF, accuracy: 0 },
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
                spelling: [],
                calculation: [],
            },
            mostRecentMistakes: {
                spelling: [],
                calculation: [],
            },
        },
    },

    {
        playerId: "u3",
        statistics: {
            wordsPerMinute: 4,
            wordsPerMinuteImprovement: +2,
            globalGrading: { grade: Grade.F, accuracy: 0 },
            globalAccuracyImprovement: 0,
            gradingPerNotion: {
                ADDITION:       { grade: Grade.XF, accuracy: 0 },
                SUBSTRACTION:   { grade: Grade.XF, accuracy: 0 },
                MULTIPLICATION: { grade: Grade.XF, accuracy: 0 },
                DIVISION:       { grade: Grade.XF, accuracy: 0 },
                REWRITING:      { grade: Grade.XF, accuracy: 0 },
                ENCRYPTION:     { grade: Grade.XF, accuracy: 0 },
                EQUATION:       { grade: Grade.XF, accuracy: 0 },
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
                spelling: [],
                calculation: [],
            },
            mostRecentMistakes: {
                spelling: [],
                calculation: [],
            },
        },
    },

    {
        playerId: "u4",
        statistics: {
            wordsPerMinute: 3,
            wordsPerMinuteImprovement: 0,
            globalGrading: { grade: Grade.F, accuracy: 0 },
            globalAccuracyImprovement: 0,
            gradingPerNotion: {
                ADDITION:       { grade: Grade.XF, accuracy: 0 },
                SUBSTRACTION:   { grade: Grade.XF, accuracy: 0 },
                MULTIPLICATION: { grade: Grade.XF, accuracy: 0 },
                DIVISION:       { grade: Grade.XF, accuracy: 0 },
                REWRITING:      { grade: Grade.XF, accuracy: 0 },
                ENCRYPTION:     { grade: Grade.XF, accuracy: 0 },
                EQUATION:       { grade: Grade.XF, accuracy: 0 },
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
                spelling: [],
                calculation: [],
            },
            mostRecentMistakes: {
                spelling: [],
                calculation: [],
            },
        },
    },
]