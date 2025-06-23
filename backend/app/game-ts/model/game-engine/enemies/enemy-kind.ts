export const EnemyKind = {
    CRAB: "CRAB",
    HIVECRAB: "HIVECRAB",
    DRONE: "DRONE",
    PAPA: "PAPA",
} as const;
export type EnemyKind = typeof EnemyKind[keyof typeof EnemyKind];

