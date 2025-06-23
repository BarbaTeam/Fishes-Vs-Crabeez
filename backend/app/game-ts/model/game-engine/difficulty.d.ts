export type Difficulty = {
    level: number,      // Incremented each time a boss is killed
    waveCount: number,  // Incremented each time a wave has ended
    harshness: number,  // Depend on the number of player in the game at the start
};
