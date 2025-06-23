import { User } from "./user.model";

export type GameInfo = {
    gameId: string,
    players: User[],
    state: 'waiting' | 'starting' | 'playing',
};