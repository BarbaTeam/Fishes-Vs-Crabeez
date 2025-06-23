import { GameID, UserID } from "./ids";
import { Grading } from "./results.model";


export type Leaderboard = {
    ranking: UserID[], // Sorted from the best to the worst
    gradingPerPlayer: Grading[],
};


export type GlobalLeaderboard = Leaderboard;


export type GameLeaderboard = Leaderboard & {
    gameId: GameID,
};
