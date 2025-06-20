"use strict";
exports.ParalysisEvent = void 0;
const event_types_1 = require("../event-types");
const player_event_1 = require("./player-event");
class ParalysisEvent extends player_event_1.PlayerEvent {
    constructor(handler, affectedPlayerId, durationInMs = ParalysisEvent.PARALYSIS_DEFAULT_DURATION_MS) {
        super(handler, event_types_1.EventKind.PARALYSIS, affectedPlayerId);
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
    onEventKill() {
        super.onEventKill();
        console.log("Paralysis on kill called");
        clearTimeout(this.timeOut);
        this.emit(false);
    }
}
exports.ParalysisEvent = ParalysisEvent;
ParalysisEvent.PARALYSIS_DEFAULT_DURATION_MS = 15000; // in ms
