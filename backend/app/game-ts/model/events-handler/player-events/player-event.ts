import { UserID } from "../../../../shared/types";

import { IEventsHandler } from "../events-handler.interface";

import { Event } from "../event";
import { EventKind } from "../event-types";



export abstract class PlayerEvent<T> extends Event<any> {
    protected _affectedPlayerId: UserID

    constructor(handler: IEventsHandler, kind: EventKind, affectedPlayerId: UserID) {
        super(handler, kind);
        this._affectedPlayerId = affectedPlayerId;
    }

    public get affectedPlayerId(): UserID {
        return this._affectedPlayerId;
    }

    protected emit(val: T) {
        super.emit({
            affectedPlayerId: this._affectedPlayerId, data: val
        });
    }
}
