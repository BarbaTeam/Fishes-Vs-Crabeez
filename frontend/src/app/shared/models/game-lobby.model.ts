import { GameID, UserID } from "./ids";



export const GameLobbyState = {
    WAITING: "WAITING",
    RUNNING: "RUNNING",
} as const;
export type GameLobbyState = typeof GameLobbyState[keyof typeof GameLobbyState];


type TempConfig = {
    addition: boolean,
    soustraction: boolean,
    multiplication: boolean,
    division: boolean,
    equation: boolean,
    numberRewrite: boolean,
    encryption: boolean,
};


export type GameLobby = {
    gameId: GameID,
    name: string,
    playersId: UserID[],
    state: GameLobbyState,
    playersTempConfig: Record<UserID, TempConfig>,
};
