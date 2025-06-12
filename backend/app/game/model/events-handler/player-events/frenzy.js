"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrenzyEvent = void 0;
const event_types_1 = require("../event-types");
const player_event_1 = require("./player-event");
class FrenzyEvent extends player_event_1.PlayerEvent {
    constructor(handler, affectedPlayerId, durationInMs = FrenzyEvent.FRENZY_DEFAULT_DURATION_MS) {
        super(handler, event_types_1.EventKind.PARALYSIS, affectedPlayerId);
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
exports.FrenzyEvent = FrenzyEvent;
FrenzyEvent.FRENZY_DEFAULT_DURATION_MS = 3000; // in ms
