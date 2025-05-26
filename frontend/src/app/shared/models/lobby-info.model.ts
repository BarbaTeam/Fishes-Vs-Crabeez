import { User } from "./user.model";

export type LobbyInfo = {
    lobbyId: number,
    players: User[],
};