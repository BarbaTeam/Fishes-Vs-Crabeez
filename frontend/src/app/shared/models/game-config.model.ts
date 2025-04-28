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
    max_duration: number | "inf",
    min_nb_players: 1|2|3,
    max_nb_players: 1|2|3,
    monsters_spawn_rate: number,
};
