import { GameInfo } from "../models/game-log.model";


export const MOCK_GAMES_INFO: GameInfo[] = [

    ////////////////////////////////////////////////////////////////////////////
    // Game 1 :

    {
        gameId: "g1",
        playerIds: ["u1", "u2", "u3"],
        date: new Date("2025-04-27T10:30:00.000Z"),
        duration: 6,
        config: {
            maxDuration: 15,
            minNbPlayers: 3,
            maxNbPlayers: 3,
            monstersSpawnRate: 1,
            encrypted: false,
        },
    },


    ////////////////////////////////////////////////////////////////////////////
    // Game 2 :

    {
        gameId: "g2",
        playerIds: ["u2", "u1", "u4"],
        date: new Date("2025-04-28T10:30:00.000Z"),
        duration: 5,
        config: {
            maxDuration: 10,
            minNbPlayers: 3,
            maxNbPlayers: 3,
            monstersSpawnRate: 1,
            encrypted: true,
        },
    },
];
