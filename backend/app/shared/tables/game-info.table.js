const { DatabaseTable } = require('./utils/db-table')
const { genGameKey } = require('./utils/key-generators');

const { GameInfoSchema } = require('../schemas/game-info.schema');



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