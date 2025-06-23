const { GlobalLeaderboardTable } = require('../tables/global-leaderboard.table');


// TODO : Defining true mock :
const MOCK_GLOBAL_LEADERBOARD_PLACEHOLDER = {
    ranking: ["u3", "u2", "u4", "u1"], // Sorted from the best to the worst
    gradingPerPlayer:[
        { grade: "B", accuracy: 83.33333333333334 },   // u3
        { grade: "D+", accuracy: 69 },                 // u2
        { grade: "F", accuracy: 52.631578947368425 },  // u4
        { grade: "F" , accuracy: 40 },                 // u1
    ],
}



exports.populateGlobalLeaderboardTable = () => {
    GlobalLeaderboardTable.reset();
    GlobalLeaderboardTable.update(
        MOCK_GLOBAL_LEADERBOARD_PLACEHOLDER
    );
}