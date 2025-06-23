import { UserID } from "../../../../shared/types";

import { IEventsHandler } from '../events-handler.interface';

import { EventKind } from "../event-types";
import { PlayerEvent } from "./player-event";



export class ParalysisEvent extends PlayerEvent<boolean> {
    private static PARALYSIS_DEFAULT_DURATION_MS = 15000; // in ms

    private _paralysisDurationInMs: number;
    private timeOut!: NodeJS.Timeout;

    constructor(
        handler: IEventsHandler,
        affectedPlayerId: UserID,
        durationInMs: number = ParalysisEvent.PARALYSIS_DEFAULT_DURATION_MS,
    ) {
        super(handler, EventKind.PARALYSIS, affectedPlayerId);
        this._paralysisDurationInMs = durationInMs;
    }

    onEventBirth() {
        super.onEventBirth();

        this.emit(true);
        this.timeOut = setTimeout(() => {
            this.emit(false);
            this.die();
        }, this._paralysisDurationInMs);
    }

    onEventKill(): void {
        super.onEventKill();
        clearTimeout(this.timeOut);
        this.emit(false);
    }
}