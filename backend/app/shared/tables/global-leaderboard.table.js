const { DatabaseSingletonTable } = require('./utils/db-table')

const { GlobalLeaderboardSchema } = require('../schemas/global-leaderboard.schema');



exports.GlobalLeaderboardTable = new DatabaseSingletonTable(
    "GlobalLeaderboard",
    GlobalLeaderboardSchema,
    () => ({
        ranking: [],
        gradingPerPlayer: [],
    }),
);
