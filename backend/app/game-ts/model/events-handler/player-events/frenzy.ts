import { UserID } from "../../../../shared/types";

import { IEventsHandler } from '../events-handler.interface';

import { EventKind } from "../event-types";
import { PlayerEvent } from "./player-event";



export class FrenzyEvent extends PlayerEvent<boolean> {
    private static FRENZY_DEFAULT_DURATION_MS = 3000; // in ms

    private timeOut!: NodeJS.Timeout;
    private _frenzyDurationInMs: number;

    constructor(
        handler: IEventsHandler,
        affectedPlayerId: UserID,
        durationInMs: number = FrenzyEvent.FRENZY_DEFAULT_DURATION_MS,
    ) {
        super(handler, EventKind.PARALYSIS, affectedPlayerId);
        this._frenzyDurationInMs = durationInMs;
    }

    onEventBirth() {
        super.onEventBirth();

        this.emit(true);
        this.timeOut = setTimeout(() => {
            this.emit(false);
            this.die();
        }, this._frenzyDurationInMs);
    }
}
