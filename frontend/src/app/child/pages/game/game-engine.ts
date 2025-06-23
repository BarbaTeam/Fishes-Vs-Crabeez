import { UserID } from "@app/shared/models/ids";
import { Background } from "./Background";
import { Player } from "./Player";
import { Projectile } from "./Projectile";
import { Enemy } from "./Enemy";
import { Crab } from "./Crab";
import { Socket } from "ngx-socket-io";
import { SocketService } from "@app/shared/services/socket.service";
import { Subscription } from "rxjs";

export class GameEngine {
    private ctx: CanvasRenderingContext2D;
    private background: Background;
    private players: Map<UserID, Player>;
    private projectiles: Projectile[];
    private enemies: Enemy[];
    private score: number;
    private gameLoopId: number | null = null;
    private subscriptions = new Subscription();

    constructor(private canvas: HTMLCanvasElement, private socket: SocketService) {
        this.initSocket();
        this.ctx = canvas.getContext('2d')!;
        this.adjustCanvasResolution();
        this.background = new Background(this, canvas);

        this.players = new Map();
        this.enemies = [];
        this.projectiles = [];
        this.score = 0;
        this.gameLoopId = window.setInterval(() => this.updateGameLoop(), 1000 / 30);
    }

    private initSocket(){
        this.subscriptions.add(
            this.socket.on<{playerId : UserID, lane : number}>('playerChangedLane').subscribe(({playerId : playerId, lane : lane})=>{
                const player = this.players.get(playerId);
                if(player){
                    player.lane = lane;
                    player.update()
                }
            })
        );
        this.subscriptions.add(
            this.socket.on<Projectile>('newProjectile').subscribe(projectile=>{
                this.projectiles.push(projectile);
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
                this.projectiles.filter(p => p.id != projectile.id);
                this.enemies.filter(e => e.id != enemy.id);
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
