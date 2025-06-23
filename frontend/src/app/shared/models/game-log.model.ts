import { GameConfig } from "./game-config.model";
import { RawResults } from "./results.model";

import { GameID, UserID } from "./ids";


export type GameInfo = {
    gameId: GameID,
    playerIds: UserID[],
    duration: number,
    config: GameConfig,
};


/**
 * BACKEND :: Type representing log of a game.
 */
export type GameLog = {
    gameId: GameID,
    info: Omit<GameInfo, "gameId">, // gameId is omitted as it would be redundant
    rawResultsList: RawResults[],
};
