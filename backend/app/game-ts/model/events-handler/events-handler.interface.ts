import { UserID } from "../../../shared/types";

import { EventID, EventKind } from "./event-types";



export interface IEventsHandler {
    readonly aliveEvents: Record<EventID, {kind: EventKind, affectedPlayerId?: UserID}>;
    getEventsAffectingPlayer(playerId: UserID): Record<EventID, {kind: EventKind}>;

    spawnEvent(kind: EventKind, ...args: any[]): void;
    killEvent(id: EventID): void;
    onEventEmission(fromKind: EventKind, data: any): void;

    updateEvents(): void;
}
