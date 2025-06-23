/*Le Soundboard de Claude <3*/

export interface SoundConfig {
    volume?: number;
    loop?: boolean;
    preload?: boolean;
}

export interface Sound {
    audio: HTMLAudioElement;
    config: SoundConfig;
    isPlaying: boolean;
    isPaused: boolean;
}

export class SoundBoard {
    private sounds: Map<string, Sound> = new Map();
    private basePath: string;
    private globalVolume: number = 1.0;
    private isMuted: boolean = false;
    private musicVolume: number = 0.5;
    private sfxVolume: number = 0.8;

    constructor(basePath: string = '../../../../assets/sons/') {
        this.basePath = basePath;
        this.initializeSounds();
    }

    private initializeSounds(): void {
        // Définir tous les sons avec leurs configurations
        const soundDefinitions = {
            // Sons d'effets
            score: { volume: 0.7, preload: true },
            hit: { volume: 0.8, preload: true },
            hurt: { volume: 0.8, preload: true},
            crystalHit: { volume: 0.6, preload: true },
            bubble: { volume: 0.5, preload: true },
            success: { volume: 0.8, preload: true },
            encrypted: { volume: 0.3, preload: true},
            decrypted: { volume: 0.3, preload: true},
            heartbeat: { volume: 0.3, preload: true},

            // Sons d'ambiance/musique (exemples)
            backgroundMusic: { volume: 0.3, loop: true, preload: false },
            //menuMusic: { volume: 0.4, loop: true, preload: false },
            crabeDechu: { volume: 0.5, loop: true, preload: false },
            
            /*
            // Sons de jeu
            enemyHit: { volume: 0.6, preload: true },
            playerHit: { volume: 0.8, preload: true },
            powerUp: { volume: 0.7, preload: true },
            gameOver: { volume: 0.9, preload: false },
            victory: { volume: 0.8, preload: false },
            
            // Sons d'ennemis
            crabAttack: { volume: 0.6, preload: true },
            droneAttack: { volume: 0.5, preload: true },
            papaRoar: { volume: 0.9, preload: true },
            */
        };

        // Créer les objets Sound pour chaque définition
        Object.entries(soundDefinitions).forEach(([name, config]) => {
            this.loadSound(name, config);
        });
    }

    private loadSound(name: string, config: SoundConfig = {}): void {
        const audio = new Audio();
        const sound: Sound = {
            audio,
            config: { volume: 0.5, loop: false, preload: true, ...config },
            isPlaying: false,
            isPaused: false
        };

        audio.src = `${this.basePath}${name}.mp3`;
        audio.volume = sound.config.volume! * this.globalVolume;
        audio.loop = sound.config.loop!;

        if (sound.config.preload) {
            audio.preload = 'auto';
        }

        // Événements audio
        audio.addEventListener('ended', () => {
            sound.isPlaying = false;
            sound.isPaused = false;
        });

        audio.addEventListener('play', () => {
            sound.isPlaying = true;
            sound.isPaused = false;
        });

        audio.addEventListener('pause', () => {
            sound.isPaused = true;
        });

        audio.addEventListener('error', (e) => {
            console.error(`Error loading sound ${name}:`, e);
        });

        this.sounds.set(name, sound);
    }

    // Méthodes principales
    public play(soundName: string, volume?: number): Promise<void> {
        const sound = this.sounds.get(soundName);
        if (!sound) {
            console.warn(`Sound ${soundName} not found`);
            return Promise.reject(`Sound ${soundName} not found`);
        }

        if (this.isMuted) {
            return Promise.resolve();
        }

        // Réinitialiser si déjà en cours
        if (sound.isPlaying) {
            sound.audio.currentTime = 0;
        }

        // Appliquer le volume
        const finalVolume = volume !== undefined ? volume : sound.config.volume!;
        sound.audio.volume = Math.min(1, finalVolume * this.globalVolume);

        return sound.audio.play().catch((error) => {
            console.error(`Error playing sound ${soundName}:`, error);
            throw error;
        });
    }

    public stop(soundName: string): void {
        const sound = this.sounds.get(soundName);
        if (sound && sound.isPlaying) {
            sound.audio.pause();
            sound.audio.currentTime = 0;
            sound.isPlaying = false;
            sound.isPaused = false;
        }
    }

    public pause(soundName: string): void {
        const sound = this.sounds.get(soundName);
        if (sound && sound.isPlaying) {
            sound.audio.pause();
        }
    }

    public resume(soundName: string): void {
        const sound = this.sounds.get(soundName);
        if (sound && sound.isPaused) {
            sound.audio.play().catch((error) => {
                console.error(`Error resuming sound ${soundName}:`, error);
            });
        }
    }

    public fadeIn(soundName: string, duration: number = 1000, targetVolume?: number): Promise<void> {
        const sound = this.sounds.get(soundName);
        if (!sound) {
            return Promise.reject(`Sound ${soundName} not found`);
        }

        const target = targetVolume !== undefined ? targetVolume : sound.config.volume!;
        sound.audio.volume = 0;
        
        return this.play(soundName).then(() => {
            return new Promise<void>((resolve) => {
                const startTime = Date.now();
                const fadeInterval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    sound.audio.volume = progress * target * this.globalVolume;
                    
                    if (progress >= 1) {
                        clearInterval(fadeInterval);
                        resolve();
                    }
                }, 16);
            });
        });
    }

    public fadeOut(soundName: string, duration: number = 1000): Promise<void> {
        const sound = this.sounds.get(soundName);
        if (!sound || !sound.isPlaying) {
            return Promise.resolve();
        }

        const startVolume = sound.audio.volume;
        
        return new Promise<void>((resolve) => {
            const startTime = Date.now();
            const fadeInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                sound.audio.volume = startVolume * (1 - progress);
                
                if (progress >= 1) {
                    clearInterval(fadeInterval);
                    this.stop(soundName);
                    resolve();
                }
            }, 16);
        });
    }

    // Méthodes de contrôle global
    public setGlobalVolume(volume: number): void {
        this.globalVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }

    public getGlobalVolume(): number {
        return this.globalVolume;
    }

    public mute(): void {
        this.isMuted = true;
        this.sounds.forEach(sound => {
            if (sound.isPlaying) {
                sound.audio.pause();
            }
        });
    }

    public unmute(): void {
        this.isMuted = false;
        this.sounds.forEach(sound => {
            if (sound.isPaused) {
                sound.audio.play().catch(console.error);
            }
        });
    }

    public toggleMute(): void {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    public isSoundMuted(): boolean {
        return this.isMuted;
    }

    public stopAll(): void {
        this.sounds.forEach((sound, name) => {
            this.stop(name);
        });
    }

    public pauseAll(): void {
        this.sounds.forEach((sound, name) => {
            this.pause(name);
        });
    }

    public resumeAll(): void {
        this.sounds.forEach((sound, name) => {
            this.resume(name);
        });
    }

    // Méthodes de gestion des catégories
    public setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        const musicSounds = ['backgroundMusic', 'menuMusic', 'bossMusic'];
        musicSounds.forEach(soundName => {
            const sound = this.sounds.get(soundName);
            if (sound) {
                sound.audio.volume = (sound.config.volume! * this.musicVolume * this.globalVolume);
            }
        });
    }

    public setSfxVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }

    private updateAllVolumes(): void {
        this.sounds.forEach(sound => {
            sound.audio.volume = sound.config.volume! * this.globalVolume;
        });
    }

    // Méthodes utilitaires
    public isPlaying(soundName: string): boolean {
        const sound = this.sounds.get(soundName);
        return sound ? sound.isPlaying : false;
    }

    public getDuration(soundName: string): number {
        const sound = this.sounds.get(soundName);
        return sound ? sound.audio.duration : 0;
    }

    public getCurrentTime(soundName: string): number {
        const sound = this.sounds.get(soundName);
        return sound ? sound.audio.currentTime : 0;
    }

    public setCurrentTime(soundName: string, time: number): void {
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.audio.currentTime = time;
        }
    }

    // Nettoyage
    public destroy(): void {
        this.stopAll();
        this.sounds.clear();
    }
}