const { populateGameInfoTable } = require('./game-info.mock');
const { populateGameLeaderboardTable } = require('./game-leaderboard.mock');
const { populateGlobalLeaderboardTable } = require('./global-leaderboard.mock');
const { populatePlayerResultsTable } = require('./players-results.mock');
const { populatePlayerStatisticsTable } = require('./players-statistics.mock');
const { populateUserTable } = require('./user.mock');



exports.populateTables = () => {
    populateGameInfoTable();
    populateGameLeaderboardTable();
    populateGlobalLeaderboardTable();
    populatePlayerResultsTable();
    populatePlayerStatisticsTable();
    populateUserTable();
}
