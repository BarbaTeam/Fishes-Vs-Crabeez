import { PlayerStatistics } from "../models/player-results.model"
import { AnsweredQuestion } from "../models/question.model"
import { Grade } from "../models/results.model"

// TODO : Defining true mocks
export const MOCK_PLAYER_STATISTICS_PLACEHOLDERS: PlayerStatistics[] = [
    {
        playerId: "u1",
        statistics: {
            wordsPerMinute: 2.466666666666667,
            wordsPerMinuteImprovement: -0.066666666666667,
            globalGrading: { grade: Grade.A, accuracy: 80 },
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
                spelling: [
                    [{} as AnsweredQuestion, 1]
                ],
                calculation: [
                    [{} as AnsweredQuestion, 1]
                ],
            },
            mostRecentMistakes: {
                spelling: [
                    [{} as AnsweredQuestion, new Date("2025-04-28T10:30:00.000Z")],
                ],
                calculation: [
                    [{} as AnsweredQuestion, new Date("2025-04-28T10:30:00.000Z")]
                ],
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
                REWRITING:      { grade: Grade.A, accuracy: 0 },
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
                spelling: [
                    [{} as AnsweredQuestion, 1]
                ],
                calculation: [
                    [{} as AnsweredQuestion, 1]
                ],
            },
            mostRecentMistakes: {
                spelling: [
                    [{} as AnsweredQuestion, new Date("2025-04-28T10:30:00.000Z")],
                ],
                calculation: [
                    [{} as AnsweredQuestion, new Date("2025-04-28T10:30:00.000Z")]
                ],
            },
        },
    },

    {
        playerId: "u3",
        statistics: {
            wordsPerMinute: 4,
            wordsPerMinuteImprovement: +2,
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
                spelling: [
                    [{} as AnsweredQuestion, 1]
                ],
                calculation: [
                    [{} as AnsweredQuestion, 1]
                ],
            },
            mostRecentMistakes: {
                spelling: [
                    [{} as AnsweredQuestion, new Date("2025-04-28T10:30:00.000Z")],
                ],
                calculation: [
                    [{} as AnsweredQuestion, new Date("2025-04-28T10:30:00.000Z")]
                ],
            },
        },
    },

    {
        playerId: "u4",
        statistics: {
            wordsPerMinute: 3,
            wordsPerMinuteImprovement: 0,
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
                spelling: [
                    [{} as AnsweredQuestion, 1]
                ],
                calculation: [
                    [{} as AnsweredQuestion, 1]
                ],
            },
            mostRecentMistakes: {
                spelling: [
                    [{} as AnsweredQuestion, new Date("2025-04-28T10:30:00.000Z")],
                ],
                calculation: [
                    [{} as AnsweredQuestion, new Date("2025-04-28T10:30:00.000Z")]
                ],
            },
        },
    },
]