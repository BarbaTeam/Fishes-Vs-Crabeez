const { DatabaseTable } = require('./utils/db-table')
const { genGameKey } = require('./utils/key-generators');

const { GameLeaderboardSchema } = require('../schemas/game-leaderboard.schema');



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
