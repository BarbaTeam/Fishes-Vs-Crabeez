import { GameID, UserID } from "./ids";
import { Grading } from "./results.model";


export type GameLeaderboard = {
    gameId: GameID,
    ranking: UserID[], // Sorted from the best to the worst
    gradingPerPlayer: Grading[],
};