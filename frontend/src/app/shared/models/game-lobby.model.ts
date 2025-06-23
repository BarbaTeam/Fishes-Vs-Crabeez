import { GameID, UserID } from "./ids";
import { UserQuestionNotionsMask } from "./user.model";



export const GameLobbyState = {
    WAITING: "WAITING",
    RUNNING: "RUNNING",
} as const;
export type GameLobbyState = typeof GameLobbyState[keyof typeof GameLobbyState];


export type GameLobby = {
    gameId: GameID,
    name: string,
    playersId: UserID[],
    state: GameLobbyState,
    playersTempConfig: Record<UserID, UserQuestionNotionsMask>,
};
