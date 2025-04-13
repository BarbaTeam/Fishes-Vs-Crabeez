import { GameConfig } from "../models/game-config.model";

export const MOCK_GAME_CONFIGS: GameConfig[] = [
    {
        maxDuration: 15,
        minNbPlayers: 2,
        maxNbPlayers: 3,
        monstersSpawnRate: 2,
        encrypted: false,
    }, {
        maxDuration: 15,
        minNbPlayers: 3,
        maxNbPlayers: 3,
        monstersSpawnRate: 1,
        encrypted: true,
    }, {
        maxDuration: "inf",
        minNbPlayers: 3,
        maxNbPlayers: 3,
        monstersSpawnRate: 1,
        encrypted: true,
    },
]