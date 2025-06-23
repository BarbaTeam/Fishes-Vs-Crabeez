const { GameInfo } = require('../types');
const { GameInfoSchema } = require('../schemas/game-info.schema');

const { DatabaseTable } = require('./utils/db-table')
const { genGameKey } = require('./utils/key-generators');



/**
 * @type {Database<GameInfo>}
 */
exports.GameInfoTable = new DatabaseTable(
    "GameInfo",
    GameInfoSchema,
    ["gameId"],
    genGameKey,
    () => ({
        playerIds: [],
        date: new Date(),
        duration: 0,
        config: {
            maxDuration: 0,
            minNbPlayers: 1,
            maxNbPlayers: 1,
            monstersSpawnRate: 0,
            encrypted: false,
        },
    }),
);