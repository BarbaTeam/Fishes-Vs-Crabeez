/**
 * Models of the game's configurations that dictates how the game
 * will act, from its duration to how hard it is.
 *
 * @prop max_duration - The maximum duration of a game (in minute).
 * @prop min_nb_players - The minimum number of player needed to start a game.
 * @prop max_nb_players - The maximum number of player that can join the game.
 * @prop monsters_spawn_rate - The rate at which the monsters spawn.
 * 1 is the usual rate.
 */
export type GameConfig = {
    maxDuration: number | "inf",

    minNbPlayers: 1|2|3,
    maxNbPlayers: 1|2|3,

    monstersSpeedCoeff: number,
    monstersSpawnRate: number,
    encrypted: boolean,
};
