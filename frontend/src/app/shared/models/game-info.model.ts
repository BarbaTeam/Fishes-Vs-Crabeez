import { User } from "./user.model";

export type GameInfo = {
    gameId: string,
    players: User[],
    state: 'En attente' | 'En préparation' | 'En cours de jeu',
};