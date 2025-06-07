const { GameLeaderboard } = require('../types');
const { GameLeaderboardSchema } = require('../schemas/game-leaderboard.schema');

const { DatabaseTable } = require('./utils/db-table')
const { genGameKey } = require('./utils/key-generators');



/**
 * @type {DatabaseTable<GameLeaderboard>}
 */
exports.GameLeaderboardTable = new DatabaseTable(
    "GameLeaderboard",
    GameLeaderboardSchema,
    ["gameId"],
    genGameKey,
    () => ({
        ranking: [],
        gradingPerPlayer: [],
    }),
);
