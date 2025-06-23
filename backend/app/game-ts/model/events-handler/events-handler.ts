import { GameModel } from '..';

import { QuestionNotion, UserID } from '../../../shared/types';

import { Enemy } from '../game-engine/enemies/enemy';

import { Event } from './event';
import { EventID, EventKind } from './event-types';
import { WaveEvent } from './game-events/wave';
import { ParalysisEvent } from './player-events/paralysis';
import { FrenzyEvent } from './player-events/frenzy';

import { IEventsHandler } from './events-handler.interface';



export class EventsHandler implements IEventsHandler {
    private _aliveEvents: Record<EventID, Event<unknown>> = {};

    constructor(
        private readonly model: GameModel,
    ) {}


    public get aliveEvents()
        : Record<EventID, {kind: EventKind, affectedPlayerId?: UserID}>
    {
        return Object.entries(this._aliveEvents).reduce((acc, [id, event]) => {
            acc[id] = {
                kind: event.kind,
                affectedPlayerId: (event as any)?.affectedPlayerId ?? undefined
            };
            return acc;
        }, {} as Record<EventID, {kind: EventKind, affectedPlayerId: UserID}>);
    }


    public spawnEvent(kind: EventKind, ...args: any[]): EventID {
        let event: Event<unknown>;
        switch (kind) {
            case EventKind.WAVE :
                event = new WaveEvent(this, args[0] as number);
                break;

            case EventKind.BOSS :
                // TODO : ...
                break;

            case EventKind.PARALYSIS :
                event = new ParalysisEvent(this, args[0] as UserID, args[1] as number|undefined);
                break;

            case EventKind.FRENZY :
                event = new FrenzyEvent(this, args[0] as UserID, args[1] as number|undefined);
                break;

            default:
                throw new Error(`Event kind: ${kind} unknown`);
        }

        this._aliveEvents[event!.id] = event!;
        event!.onEventBirth();
        return event!.id;
    }


    onEventEmission(fromKind: EventKind, emittedVal: any): void {
        switch (fromKind) {
            case EventKind.WAVE :
                for (const enemy of emittedVal as Enemy[]) {
                    this.model.gameEngine.spawnEnemy(enemy);
                }
                break;

            case EventKind.BOSS :
                // TODO : ...
                break;

            case EventKind.PARALYSIS :
                const paralysed: boolean = emittedVal.data;
                const affectedPlayerId = emittedVal.affectedPlayerId;
                if (paralysed) {
                    this.model.gameEngine.paralysePlayer(affectedPlayerId);
                } else {
                    this.model.gameEngine.deparalysePlayer(affectedPlayerId);
                    const notionMask = {...this.model.gameLobby.playersNotionsMask[affectedPlayerId], [QuestionNotion.ENCRYPTION]: false};
                    this.model.quizHandler.sendQuestion(affectedPlayerId, notionMask);
                }
                break;

            case EventKind.FRENZY :
                // TODO : ...
                break;

            default:
                throw new Error(`Event kind: ${fromKind} unknown`);
        }
    }


    public updateEvents() {
        const stillAliveEvents: Record<EventID, Event<unknown>> = {};
        for (let event of Object.values(this._aliveEvents)) {
            if (!event.isAlive) {
                event.onEventDeath()
                continue;
            }
            event.onEventUpdate();
        }
        this._aliveEvents = stillAliveEvents;
    }


    public killEvent(id: EventID): void {
        this._aliveEvents[id].onEventKill();
        delete this._aliveEvents[id];
    }
}