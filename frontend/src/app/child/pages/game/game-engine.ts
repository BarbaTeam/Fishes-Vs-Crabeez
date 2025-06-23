import { UserID } from "@app/shared/models/ids";
import { Background } from "./Background";
import { Player } from "./Player";
import { Projectile } from "./Projectile";
import { Enemy } from "./Enemy";
import { Crab } from "./Crab";

export class GameEngine {
    private ctx: CanvasRenderingContext2D;
    private background: Background;
    private players: Map<UserID, Player>;
    private projectiles: Projectile[];
    private enemies: Enemy[];
    private score: number;
    private gameLoopId: number | null = null;

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.adjustCanvasResolution();
        this.background = new Background(this, canvas);

        this.players = new Map();
        this.enemies = [];
        this.projectiles = [];
        this.score = 0;
        this.init();
    }

    init() {
        this.gameLoopId = window.setInterval(() => this.updateGameLoop(), 1000 / 30);
    }

    stop() {
        if (this.gameLoopId !== null) {
            clearInterval(this.gameLoopId);
            this.gameLoopId = null;
        }
    }

    private update(): void {
        for (const player of this.players.values()) {
            player.update();
        }
        for (const enemy of this.enemies) {
            enemy.update();
        }
        for (const projectile of this.projectiles) {
            projectile.update();
        }

        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemies = this.enemies.filter(e => e.alive);
    }

    private draw(ctx: CanvasRenderingContext2D): void {
        this.background.draw(ctx);

        for (const player of this.players.values()) {
            player.draw(ctx);
        }

        this.projectiles.forEach(projectile => {
            projectile.draw(ctx);
        });

        this.enemies.forEach(enemy => {
            if(enemy instanceof Crab){
                enemy.draw(ctx);
            }
        });
    }

    private adjustCanvasResolution(): void {
        const scale = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * scale;
        this.canvas.height = this.canvas.clientHeight * scale;
        this.ctx.scale(scale, scale);
    }

    private updateGameLoop(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();
        this.draw(this.ctx);
    }
}
