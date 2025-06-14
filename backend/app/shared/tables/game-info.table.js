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
            maxNbPlayers: 3,

            monstersSpeedCoeff: 1,
            monstersSpawnRate: 1,

            encrypted: false,
        },
    }),
);