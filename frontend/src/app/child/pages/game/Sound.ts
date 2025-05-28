function playSound(sound: string, volume: number): void {
    const audio = new Audio(`../../../../assets/sons/${sound}.mp3`);
    audio.volume = volume;
    audio.play().catch((error) => {
        console.error("Error playing sound:", error);
    });
}

export function playScoreSound(volume: number): void {
    playSound("score", volume);
}

export function playKillSound(volume: number): void {
    playSound("kill", volume);
}

export function crystalHitSound(volume: number): void {
    playSound("crystalHit", volume);
}

export function playBubbleSound(volume: number): void {
    playSound("bubble", volume);
}

export function playSuccess(volume:number): void {
    playSound("success",volume);
}