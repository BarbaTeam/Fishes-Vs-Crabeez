import { GameConfig } from "../models/game-config.model";

export const MOCK_GAME_CONFIGS: GameConfig[] = [
    {
        max_duration: 15,
        min_nb_players: 2,
        max_nb_players: 3,
        monsters_spawn_rate: 2,
        encrypted: false,
    }, {
        max_duration: 15,
        min_nb_players: 3,
        max_nb_players: 3,
        monsters_spawn_rate: 1,
        encrypted: true,
    }, {
        max_duration: "inf",
        min_nb_players: 3,
        max_nb_players: 3,
        monsters_spawn_rate: 1,
        encrypted: true,
    },
]