export type EventID = `event-${number}`;


export const EventKind = {
    // Game's Events :
    WAVE: "WAVE",
    BOSS: "BOSS",
    // ...

    // Player's Events :
    PARALYSIS: "PARALYSIS",
    FRENZY: "FRENZY",
} as const;
export type EventKind = typeof EventKind[keyof typeof EventKind];
