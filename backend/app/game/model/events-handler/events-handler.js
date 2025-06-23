"use strict";
exports.EventsHandler = void 0;
const event_types_1 = require("./event-types");
const wave_1 = require("./game-events/wave");
const boss_wave_1 = require("./game-events/boss-wave");
const paralysis_1 = require("./player-events/paralysis");
const frenzy_1 = require("./player-events/frenzy");
class EventsHandler {
    constructor(model) {
        this.model = model;
        this._aliveEvents = {};
    }
    get aliveEvents() {
        return Object.entries(this._aliveEvents).reduce((acc, [id, event]) => {
            var _a;
            acc[id] = {
                kind: event.kind,
                affectedPlayerId: (_a = event === null || event === void 0 ? void 0 : event.affectedPlayerId) !== null && _a !== void 0 ? _a : undefined
            };
            return acc;
        }, {});
    }
    getEventsAffectingPlayer(playerId) {
        return Object.entries(this.aliveEvents)
            .filter(([id, ev]) => (ev === null || ev === void 0 ? void 0 : ev.affectedPlayerId) === playerId)
            .reduce((acc, [id, ev]) => {
            acc[id] = { kind: ev.kind };
            return acc;
        }, {});
    }
    spawnEvent(kind, ...args) {
        let event;
        switch (kind) {
            case event_types_1.EventKind.WAVE:
                event = new wave_1.WaveEvent(this, args[0]);
                break;
            case event_types_1.EventKind.BOSS_WAVE:
                event = new boss_wave_1.BossWaveEvent(this, args[0]);
                break;
            case event_types_1.EventKind.PARALYSIS:
                event = new paralysis_1.ParalysisEvent(this, args[0], args[1]);
                break;
            case event_types_1.EventKind.FRENZY:
                event = new frenzy_1.FrenzyEvent(this, args[0], args[1]);
                break;
            default:
                throw new Error(`Event kind: ${kind} unknown`);
        }
        this._aliveEvents[event.id] = event;
        event.onEventBirth();
        return event.id;
    }
    onEventEmission(fromKind, emittedVal) {
        switch (fromKind) {
            case event_types_1.EventKind.WAVE:
                for (const enemy of emittedVal) {
                    this.model.gameEngine.spawnEnemy(enemy);
                }
                break;
            case event_types_1.EventKind.BOSS_WAVE:
                for (const enemy of emittedVal) {
                    this.model.gameEngine.spawnEnemy(enemy);
                }
                break;
            case event_types_1.EventKind.PARALYSIS:
                const paralysed = emittedVal.data;
                const affectedPlayerId = emittedVal.affectedPlayerId;
                if (paralysed) {
                    this.model.gameEngine.paralysePlayer(affectedPlayerId);
                }
                else {
                    this.model.gameEngine.deparalysePlayer(affectedPlayerId);
                }
                break;
            case event_types_1.EventKind.FRENZY:
                // TODO : ...
                break;
            default:
                throw new Error(`Event kind: ${fromKind} unknown`);
        }
    }
    updateEvents() {
        const stillAliveEvents = {};
        for (let event of Object.values(this._aliveEvents)) {
            if (!event.isAlive) {
                event.onEventDeath();
                continue;
            }
            stillAliveEvents[event.id] = event;
            event.onEventUpdate();
        }
        this._aliveEvents = stillAliveEvents;
    }
    killEvent(id) {
        this._aliveEvents[id].onEventKill();
        delete this._aliveEvents[id];
    }
}
exports.EventsHandler = EventsHandler;
