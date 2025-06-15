import { GameID, UserID } from "./ids";
import { PlayerConfig } from "./user.model";



export const GameState = {
    WAITING: "WAITING",
    RUNNING: "RUNNING",
} as const;
export type GameState = typeof GameState[keyof typeof GameState];


type _GameLobby = {
    name: string,
    state: GameState,
    playersId: UserID[],
};


type _GameConfig = {
    maxDuration: number | "inf",

    minNbPlayers: 1|2|3,
    maxNbPlayers: 1|2|3,

    monstersSpeedCoeff: number,
    monstersSpawnRate: number,
    encrypted: boolean,
};


/**
 * Models of a game's lobby describing in superficial way an existing game.
 *
 * @prop gameId - The id of the game.
 * @prop name - The name of the game.
 * @prop state - The state of the game i.e whether its running or waiting.
 * @prop playersId - The list of all connected players'id.
 */
export type GameLobby =
    & { gameId: GameID }
    & _GameLobby;


/**
 * Models of the game's configurations that dictates how the game
 * will act, from its duration to how hard it is.
 *
 * @prop gameId - The id of the game.
 * @prop max_duration - The maximum duration of a game (in minute).
 * @prop min_nb_players - The minimum number of player needed to start a game.
 * @prop max_nb_players - The maximum number of player that can join the game.
 * @prop monsters_spawn_rate - The rate at which the monsters spawn.
 * 1 is the usual rate.
 */
export type GameConfig =
    & { gameId: GameID }
    & _GameConfig;


export type Game =
    & { gameId: GameID }
    & _GameLobby
    & {
        gameConfig: _GameConfig,
        playersConfig: Record<UserID, PlayerConfig>,
    };
