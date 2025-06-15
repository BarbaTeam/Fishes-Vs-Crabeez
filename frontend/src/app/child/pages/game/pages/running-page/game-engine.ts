import { Subject, Subscription } from "rxjs";

import { SocketService } from "@app/shared/services/socket.service";

import { UserID } from "@app/shared/models/ids";

import { Player } from "./Player";
import { Projectile } from "./Projectile";

import { Enemy } from "./ennemies/Enemy";
import { Crab } from "./ennemies/Crab";
import { HiveCrab } from "./ennemies/HiveCrab";
import { Drone } from "./ennemies/Drone";
import { Papa } from "./ennemies/Papa";
import { SoundBoard } from "./SoundBoard";



export class GameEngine {
    private ctx: CanvasRenderingContext2D;
    private players: Map<UserID, Player>;
    private projectiles: Projectile[];
    private enemies: Map<string, Enemy>;
    private personalScore: number;
    public generalScore$ = new Subject<number>();
    private generalScore: number;
    public health$ = new Subject<number>();
    private health : number;
    public waveCounter$ = new Subject<number>();
    private waveCounter : number;
    public bossWave$ = new Subject<boolean>();
    private bossWave : boolean;
    public bossHealth$ = new Subject<number>();
    private bossHealth : number;
    public hasEnded$ = new Subject<boolean>();
    private hasEnded : boolean;
    private gameLoopId: number | null = null;
    private subscriptions = new Subscription();
    private receivedStartup = false;

    private soundBoard: SoundBoard;

    public localPlayerImageSrc$ = new Subject<string>();
    public localPlayerImageSrc: string = '';
    public localPlayerPlayerParalysed$ = new Subject<boolean>();
    public localPlayerPlayerParalysed = false;
    public player1ImageSrc$ = new Subject<string>();
    public player1ImageSrc?: string;
    public player2ImageSrc$ = new Subject<string>();
    public player2ImageSrc?: string;

    constructor(
        private canvas: HTMLCanvasElement,
        private socket: SocketService,
        private localPlayerId: UserID,
    ) {
        this.initSocket();
        this.ctx = canvas.getContext('2d')!;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.soundBoard = new SoundBoard();
        this.soundBoard.play('backgroundMusic');

        this.players = new Map();
        this.enemies = new Map();
        this.projectiles = [];
        this.personalScore = 0;
        this.generalScore = 0;
        this.health = 10;
        this.waveCounter = 0;
        this.bossWave = false;
        this.bossHealth = 0;
        this.hasEnded = false;
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
                    const newPlayer = Player.fromJSON(player, this.localPlayerId, this.canvas);
                    this.players.set(player.id, newPlayer);
                    if (player.id === this.localPlayerId) {
                        this.localPlayerImageSrc = newPlayer.playerIconUrl;
                        this.localPlayerImageSrc$.next(this.localPlayerImageSrc);
                        console.log("[STARTUP] Local player image source set to: ", this.localPlayerImageSrc);
                    }
                    else if (!this.player1ImageSrc) {
                        this.player1ImageSrc = newPlayer.playerIconUrl;
                        this.player1ImageSrc$.next(this.player1ImageSrc);
                        console.log("[STARTUP] Player 1 image source set to: ", this.player1ImageSrc);
                    }
                    else if (!this.player2ImageSrc) {
                        this.player2ImageSrc = newPlayer.playerIconUrl;
                        this.player2ImageSrc$.next(this.player2ImageSrc);
                        console.log("[STARTUP] Player 2 image source set to: ", this.player2ImageSrc);
                    }
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('playerChangedLane').subscribe(({playerId, x, y})=>{
                const player = this.players.get(playerId);
                if(player){
                    player.x = x;
                    player.y = y;
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('playerChangedPosition').subscribe(({playerId, x, y})=>{
                const player = this.players.get(playerId);
                if(player){
                    player.x = x;
                    player.y = y;
                }
            })
        );
        
        this.subscriptions.add(
            this.socket.on<any>('newProjectile').subscribe(({playerId, projectile})=>{ 
                console.log(playerId);
                console.log(this.players.get(playerId));
                console.log(projectile);
                this.projectiles.push(Projectile.fromJSON(projectile, this.canvas, this.players.get(playerId)!));

                if(projectile.playerId == this.localPlayerId){
                    this.soundBoard.play('bubble');
                }

            })
        );
        this.subscriptions.add(
            this.socket.on<number>('playerScoreUpdated').subscribe(score=>{
                this.personalScore = score;
            })
        );
        this.subscriptions.add(
            this.socket.on<number>('scoreUpdated').subscribe(score=>{
                this.generalScore = score;
                this.generalScore$.next(this.generalScore);
            })
        );
        this.subscriptions.add(
            this.socket.on<number>('healthUpdated').subscribe(health=>{
                this.health = health;
                this.health$.next(this.health);

                this.soundBoard.play("hurt");
                if(this.health < 3) {
                    this.soundBoard.play("heartbeat");
                } else {
                    this.soundBoard.stop("heartbeat");
                }
            })
        );
        this.subscriptions.add(
            this.socket.on<number>('newWave').subscribe(waveCounter=>{
                this.waveCounter = waveCounter;
                this.waveCounter$.next(this.waveCounter);
            })
        );
        this.subscriptions.add(
            this.socket.on<boolean>('gameEnded').subscribe(() => {
                this.hasEnded = true;
                this.hasEnded$.next(this.hasEnded);
                this.soundBoard.destroy();
            })
        );
        this.subscriptions.add(
            this.socket.on<any>('enemyAdded').subscribe(enemy=>{
                switch (enemy.type) {
                    case 'crab':
                        const crab = Crab.fromJson(enemy, this.canvas);
                        this.enemies.set(crab._id ,crab);
                        console.log(`New Crab received: ${crab.id}, position: (${crab.x}, ${crab.y})`);
                        break;
                    case 'hive-crab':
                        const hiveCrab = HiveCrab.fromJson(enemy, this.canvas);
                        this.enemies.set(hiveCrab._id, hiveCrab);
                        console.log(`New Hive Crab received: ${hiveCrab.id}, position: (${hiveCrab.x}, ${hiveCrab.y})`);
                        break;
                    case 'drone':
                        const drone = Drone.fromJson(enemy, this.canvas);
                        this.enemies.set(drone._id, drone);
                        console.log(`New Drone received: ${drone.id}, position: (${drone.x}, ${drone.y})`);
                        break;
                    case 'papa':
                        const papa = Papa.fromJson(enemy, this.canvas);
                        this.enemies.set(papa._id, papa);
                        console.log(`ATTENTION NEW PAPA SPAWNED IN THE SEA : ${papa.id}, position: (${papa.x}, ${papa.y})`);
                        this.bossHealth = papa.health;
                        this.bossHealth$.next(this.bossHealth);
                        break;
                    default:
                        console.warn(`Unknown enemy type: ${enemy.type}`);
                }
            })
        );
        this.subscriptions.add(
            this.socket.on<{projectile: any, enemyId: string}>('enemyKilled').subscribe(({projectile : projectile, enemyId : enemyId})=>{
                this.projectiles = this.projectiles.filter(p => p.id !== projectile.id);
                this.enemies.delete(enemyId);

                if(projectile.playerId == this.localPlayerId){
                    this.soundBoard.play("score");
                }

            })
        );

        this.subscriptions.add(
            this.socket.on<{projectile: any, enemyId: string, enemyHealth: number}>('enemyHit').subscribe(({projectile : projectile, enemyId : enemyId, enemyHealth: enemyHealth})=>{
                this.projectiles = this.projectiles.filter(p => p.id !== projectile.id);
                const enemy = this.enemies.get(enemyId);
                if(enemy){
                    enemy.health = enemyHealth;

                    if(enemy.type == "papa"){
                        this.bossHealth = enemyHealth;
                        this.bossHealth$.next(this.bossHealth);
                    }

                    enemy.enemyImage.src = enemy.enemyHitUrl!;
                    setTimeout(() => {
                        enemy.enemyImage.src = enemy.enemyUrl!;
                    }, 100)
                }
    
                if(projectile.playerId == this.localPlayerId){
                    this.soundBoard.play("hit");
                }

            })
        );

        this.subscriptions.add(
            this.socket.on<string>('enemyDespawned').subscribe(enemyId => {
                this.enemies.delete(enemyId);
            })
        );
        
        this.subscriptions.add(
            this.socket.on<UserID>('playerParalysed').subscribe(playerId => {
                const player = this.players.get(playerId)!;
                player.paralysed = true;
                if(player.id == this.localPlayerId){
                    this.localPlayerPlayerParalysed$.next(player.paralysed);
                }
            })
        );
        this.subscriptions.add(
            this.socket.on<UserID>('playerDeparalysed').subscribe(playerId => {
                const player = this.players.get(playerId)!;
                player.paralysed = false;
                if(player.id == this.localPlayerId){
                    this.localPlayerPlayerParalysed$.next(player.paralysed);
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<void>('bossWave').subscribe(() => {
                this.bossWave = true;
                this.bossWave$.next(this.bossWave);

                this.soundBoard.fadeOut('backgroundMusic', 1000)
                this.soundBoard.fadeIn('crabeDechu', 2000);

            })
        );

        this.subscriptions.add(
            this.socket.on<void>('bossKilled').subscribe(() => {
                this.bossWave = false;
                this.bossWave$.next(this.bossWave);

                this.soundBoard.stop('crabeDechu');
                this.soundBoard.play('success');
                this.soundBoard.fadeIn('backgroundMusic');

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
        for (const [, enemy] of this.enemies) {
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
            if(enemy){
                enemy.draw(ctx);
            }
        });
    }

    resizeCanvas() {
        const aspectRatio = 16 / 9;
        const parent = this.canvas.parentElement!;
        const availableWidth = parent.clientWidth;
        const availableHeight = parent.clientHeight;

        let width = availableWidth;
        let height = availableWidth / aspectRatio;

        if (height > availableHeight) {
            height = availableHeight;
            width = height * aspectRatio;
        }

        this.canvas.width = width;
        this.canvas.height = height;
    }

    private updateGameLoop(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();
        // debut debug
        //for (let i = 0; i <= 5; i++) {
        //    const y = scaleToCanvas(0, i * 11.75, 0, 0, this.canvas).y;
        //    this.ctx.beginPath();
        //    this.ctx.moveTo(0, y);
        //    this.ctx.lineTo(this.canvas.width, y);
        //    this.ctx.strokeStyle = "rgba(0, 0, 0)";
        //    this.ctx.stroke();
        //}
        // fin debug
        this.draw(this.ctx);
    }
}
