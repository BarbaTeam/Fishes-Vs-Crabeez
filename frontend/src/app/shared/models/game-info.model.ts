import { GameConfig } from "./game.model";

import { GameID, UserID } from "./ids";



export type GameInfo = {
    gameId: GameID,
    playerIds: UserID[],
    date: Date,
    duration: number,
    config: Omit<GameConfig, "gameId">,
};
