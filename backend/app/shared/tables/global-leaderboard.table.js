const { GlobalLeaderboard } = require('../types');
const { GlobalLeaderboardSchema } = require('../schemas/global-leaderboard.schema');

const { DatabaseSingletonTable } = require('./utils/db-table')



/**
 * @type {DatabaseSingletonTable<GlobalLeaderboard>}
 */
exports.GlobalLeaderboardTable = new DatabaseSingletonTable(
    "GlobalLeaderboard",
    GlobalLeaderboardSchema,
    () => ({
        ranking: [],
        gradingPerPlayer: [],
    }),
);
