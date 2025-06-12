"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerEvent = void 0;
const event_1 = require("../event");
class PlayerEvent extends event_1.Event {
    constructor(handler, kind, affectedPlayerId) {
        super(handler, kind);
        this._affectedPlayerId = affectedPlayerId;
    }
    get affectedPlayerId() {
        return this._affectedPlayerId;
    }
    emit(val) {
        super.emit({
            affectedPlayerId: this._affectedPlayerId, data: val
        });
    }
}
exports.PlayerEvent = PlayerEvent;
