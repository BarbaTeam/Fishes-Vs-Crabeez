import { GameID, UserID } from "./ids";
import { Results, Statistics } from "./results.model";


export type PlayerResults = {
    playerId: UserID,
    gameId: GameID,
    results: Results,
    answersShown: boolean,
};


export type PlayerStatistics = {
    playerId: UserID,
    statistics: Statistics,
};
