import { Subscription } from "rxjs";

import { SocketService } from "@app/shared/services/socket.service";

import { UserID } from "@app/shared/models/ids";

import { Player } from "./Player";
import { Projectile } from "./Projectile";

import { Enemy } from "./ennemies/Enemy";
import { Crab } from "./ennemies/Crab";



export class GameEngine {
    private ctx: CanvasRenderingContext2D;
    private players: Map<UserID, Player>;
    private projectiles: Projectile[];
    private enemies: Enemy[];
    private score: number;
    private gameLoopId: number | null = null;
    private subscriptions = new Subscription();
    private receivedStartup = false;

    constructor(
        private canvas: HTMLCanvasElement,
        private socket: SocketService,
        private localPlayerId: UserID,
    ) {
        this.initSocket();
        this.ctx = canvas.getContext('2d')!;
        this.adjustCanvasResolution();
        window.addEventListener('resize', () => this.adjustCanvasResolution());

        this.players = new Map();

        this.enemies = [];
        this.projectiles = [];
        this.score = 0;
        this.gameLoopId = window.setInterval(() => this.updateGameLoop(), 1000 / 30);

        this._startup();
    }

    private _startup() {
        this.socket.sendMessage('requestStartup');
    }

    private initSocket() {
        this.subscriptions.add(
            this.socket.on<any>('gameStartup').subscribe((startupPackage: any) => {
                if (this.receivedStartup) {
                    return;
                }
                this.receivedStartup = true;

                console.log("[STARTUP] Package :");
                console.log(startupPackage);
                
                const players = startupPackage.players;
                for (let player of players) {
                    this.players.set(player.id, Player.fromJSON(player, this.canvas));
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('playerChangedLane').subscribe(({playerId : playerId, lane : lane})=>{
                const player = this.players.get(playerId);
                if(player){
                    player.lane = lane;
                    player.update()
                }
            })
        );
        this.subscriptions.add(
            this.socket.on<any>('newProjectile').subscribe(({playerId, projectile})=>{ //c'est degeu TODO trouver une alternative pitié D:
                console.log(playerId);
                console.log(this.players.get(playerId));
                console.log(projectile);
                this.projectiles.push(Projectile.fromJSON(projectile, this.canvas, this.players.get(playerId)!));
            })
        );
        this.subscriptions.add(
            this.socket.on<number>('scoreUpdated').subscribe(score=>{
                this.score = score;
            })
        );
        this.subscriptions.add(
            this.socket.on<Enemy>('enemyAdded').subscribe(enemy=>{
                this.enemies.push(enemy);
            })
        );
        this.subscriptions.add(
            this.socket.on<{projectile: Projectile, enemy: Enemy}>('enemyKilled').subscribe(({projectile : projectile, enemy : enemy})=>{
                this.projectiles = this.projectiles.filter(p => p.id !== projectile.id);
                this.enemies = this.enemies.filter(e => e.id != enemy.id);
            })
        );
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
    }

    private draw(ctx: CanvasRenderingContext2D): void {
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

        this.canvas.style.width = "100vw";
        this.canvas.style.height = "100vh";

        this.canvas.width = window.innerWidth * scale;
        this.canvas.height = window.innerHeight * scale;

        this.ctx.scale(scale, scale);
    }

    private updateGameLoop(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();
        this.draw(this.ctx);
    }
}
