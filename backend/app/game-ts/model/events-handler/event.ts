import { IEventsHandler } from './events-handler.interface';

import { EventID, EventKind } from "./event-types";



export abstract class Event<T> {
    private _id: EventID;
    private _kind: EventKind;
    private _isAlive!: boolean;

    constructor (
        private handler: IEventsHandler, kind: EventKind
    ) {
        this._id = `event-${Date.now()}`;
        this._kind = kind;
    }


    ////////////////////////////////////////////////////////////////////////////
    // Getters :

    get id(): EventID {
        return this._id;
    }

    get kind(): EventKind {
        return this._kind;
    }

    get isAlive(): boolean {
        return this._isAlive;
    }


    ////////////////////////////////////////////////////////////////////////////
    // Reactions :

    onEventBirth() : void { this._isAlive = true; }
    onEventUpdate(): void {}
    onEventKill()  : void { this._isAlive = false; }
    onEventDeath() : void {}


    ////////////////////////////////////////////////////////////////////////////
    // Actions :

    protected die() {
        this._isAlive = false;
    }

    protected emit(val: T) {
        this.handler.onEventEmission(this.kind, val);
    }
}
