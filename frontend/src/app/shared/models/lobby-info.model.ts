import { User } from "./user.model";

export type LobbyInfo = {
    lobbyId: string,
    players: User[],
};