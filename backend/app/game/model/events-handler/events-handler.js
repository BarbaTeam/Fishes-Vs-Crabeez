"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsHandler = void 0;
const types_1 = require("../../../shared/types");
const event_types_1 = require("./event-types");
const wave_1 = require("./game-events/wave");
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
    spawnEvent(kind, ...args) {
        let event;
        switch (kind) {
            case event_types_1.EventKind.WAVE:
                event = new wave_1.WaveEvent(this, args[0]);
                break;
            case event_types_1.EventKind.BOSS:
                // TODO : ...
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
                const enemy = emittedVal;
                this.model.gameEngine.spawnEnemy(enemy);
                break;
            case event_types_1.EventKind.BOSS:
                // TODO : ...
                break;
            case event_types_1.EventKind.PARALYSIS:
                const paralysed = emittedVal.data;
                const affectedPlayerId = emittedVal.affectedPlayerId;
                if (paralysed) {
                    this.model.gameEngine.paralysePlayer(affectedPlayerId);
                }
                else {
                    this.model.gameEngine.deparalysePlayer(affectedPlayerId);
                    const notionMask = Object.assign(Object.assign({}, this.model.gameLobby.playersNotionsMask[affectedPlayerId]), { [types_1.QuestionNotion.ENCRYPTION]: false });
                    this.model.quizHandler.sendQuestion(affectedPlayerId, notionMask);
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
