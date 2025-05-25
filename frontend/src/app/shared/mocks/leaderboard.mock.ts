import { GameLeaderboard, GlobalLeaderboard } from "../models/leaderboard.model";


// TODO : Making true global leaderboard mock once true statistics mocks are made
export const MOCK_GLOBAL_LEADERBOARD_PLACEHOLDER: GlobalLeaderboard = {
    ranking: ["u3", "u2", "u4", "u1"], // Sorted from the best to the worst
    gradingPerPlayer:[
        { grade: "B", accuracy: 83.33333333333334 },  // u3
        { grade: "D", accuracy: 69 },                // u2
        { grade: "F", accuracy: 52.631578947368425 },  // u4
        { grade: "F" , accuracy: 40 },                // u1
    ],
}


export const MOCK_GAMES_LEADERBOARD: GameLeaderboard[] = [
    ////////////////////////////////////////////////////////////////////////////
    // Game 1 :

    {
        gameId: "g1",
        ranking: ["u3", "u2", "u1"], // Sorted from the best to the worst
        gradingPerPlayer: [
            { grade: "B", accuracy: 83.33333333333334 },  // u3
            { grade: "D", accuracy: 69.23076923076923 }, // u2
            { grade: "F" , accuracy: 40 },                // u1
        ]
    },


    ////////////////////////////////////////////////////////////////////////////
    // Game 2 :

    {
        gameId: "g2",
        ranking: ["u2", "u4", "u1"], // Sorted from the best to the worst
        gradingPerPlayer: [
            { grade: "D", accuracy: 68.75 },             // u2
            { grade: "F", accuracy: 52.631578947368425 }, // u4
            { grade: "F", accuracy: 37.5 },               // u1
        ]
    },

    // [...]
];