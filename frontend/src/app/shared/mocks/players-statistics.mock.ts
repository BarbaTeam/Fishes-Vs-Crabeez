import { PlayerStatistics } from "../models/player-results.model"
import { Grade } from "../models/results.model"

// TODO : Defining true mocks
export const MOCK_PLAYER_STATISTICS_PLACEHOLDERS: PlayerStatistics[] = [
    {
        playerId: "u1",
        resultsSummary: {
            globalGrading: { grade: Grade.XF, accuracy: 0 },
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
        answersShown: false,
    },

    {
        playerId: "u2",
        resultsSummary: {
            globalGrading: { grade: Grade.XF, accuracy: 0 },
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
        answersShown: false,
    },

    {
        playerId: "u3",
        resultsSummary: {
            globalGrading: { grade: Grade.XF, accuracy: 0 },
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
        answersShown: false,
    },

    {
        playerId: "u4",
        resultsSummary: {
            globalGrading: { grade: Grade.XF, accuracy: 0 },
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
        answersShown: false,
    },
]