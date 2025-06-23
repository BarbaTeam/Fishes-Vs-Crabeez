"use strict";
exports.Event = void 0;
class Event {
    constructor(handler, kind) {
        this.handler = handler;
        this._id = `event-${Date.now()}`;
        this._kind = kind;
    }
    ////////////////////////////////////////////////////////////////////////////
    // Getters :
    get id() {
        return this._id;
    }
    get kind() {
        return this._kind;
    }
    get isAlive() {
        return this._isAlive;
    }
    ////////////////////////////////////////////////////////////////////////////
    // Reactions :
    onEventBirth() { this._isAlive = true; }
    onEventUpdate() { }
    onEventKill() { this._isAlive = false; }
    onEventDeath() { }
    ////////////////////////////////////////////////////////////////////////////
    // Actions :
    die() {
        this._isAlive = false;
    }
    emit(val) {
        this.handler.onEventEmission(this.kind, val);
    }
}
exports.Event = Event;
