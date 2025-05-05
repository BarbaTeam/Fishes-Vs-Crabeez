import { Enemy } from "./Enemy";
import { Crab } from "./Crab";

import { GameComponent } from "./game.component";
import { Player } from "./Player";
import { HiveCrab } from "./HiveCrab";
import { Drone } from "./Drone";
import { Ui } from "./Ui";
import { Background } from "./Background";
import { Turtle } from "./Turtle";
import { QuestionNotion } from "src/app/shared/models/question.model";
import { playBubbleSound, playKillSound, playScoreSound, playSuccess } from "./Sound";

export class GameEngine {
    private ctx: CanvasRenderingContext2D;
    private background: Background;
    private turtle: Turtle
    private player : Player;
    private currentQuestionNotion: QuestionNotion;
    private Ui: Ui;
    private score: number;
    private enemies: Enemy[];
    private speed: number;

    constructor(
        private gameComponent: GameComponent,
        private canvas: HTMLCanvasElement
    ) {
        this.ctx = canvas.getContext('2d')!;
        this.adjustCanvaResolution();
        this.background = new Background(this, canvas);
        this.turtle = new Turtle(this, canvas);
        this.player = new Player(this, canvas);
        this.currentQuestionNotion = gameComponent.questionNotion;
        this.enemies = [new Crab(this, canvas)];
        this.Ui = new Ui(this, canvas);
        this.score = 0;
        this.speed = 1;
        this.startGameLoop();
    }

    public answerCorrectly(player : Player): void {
        if(this.closestEnemy(player.seatValue) && this.questionNotion !== "ENCRYPTION" ){
            this.player.shoot();
            playBubbleSound(this.gameComponent.user.userConfig.sound);
        }
    }
    public get speedValue(): number {
        return this.speed;
    }

    public get scoreValue(): number {
        return this.score;
    }

    public get turtlePosition(): {x:number, y:number} {
        return this.turtle.position;
    }

    public get playerPosition(): {x:number, y:number} {
        return this.player.position;
    }

    public get playerInstance(){
        return this.player;
    }

    public set questionNotion(value: QuestionNotion) {
        this.currentQuestionNotion = value;
    }

    public get questionNotion(): QuestionNotion {
        return this.currentQuestionNotion;
    }

    public closestEnemy(side: number): Enemy | undefined {
        const enemiesOnSide = this.enemies.filter(enemy => enemy.sideValue === side);

        if(!enemiesOnSide[0]){
            return undefined;
        }
        let closest = enemiesOnSide[0];
        this.enemies.forEach(enemy=>{
            if(enemy.position.y > closest.position.y) closest = enemy;
        });
        return closest;
    }

    private checkCollision(obj1: any, obj2: any): boolean {
        if (!obj1 || !obj2) return false;
        if (!obj1.position || !obj2.position) return false;

        const dx = obj1.position.x - obj2.position.x;
        const dy = obj1.position.y - obj2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < obj1.width / 2 + obj2.width / 2;
    }

    private kill(enemy: Enemy): void {
        if(enemy instanceof HiveCrab){
            this.enemies.push(new Drone(this,this.canvas, enemy.position.x, enemy.position.y - 50, enemy.sideValue), new Drone(this,this.canvas, enemy.position.x+40, enemy.position.y-80, enemy.sideValue), new Drone(this,this.canvas, enemy.position.x-100, enemy.position.y, enemy.sideValue));
        }
        playKillSound(this.gameComponent.user.userConfig.sound);
        enemy.destroy();
    }

    private addEnemy(): void {
        let newEnemy = Math.random() > 0.3 ? new Crab(this,this.canvas) : new HiveCrab(this, this.canvas);
        this.enemies.push(newEnemy);
    }

    private update(): void {
        this.background.update();
        this.player.update();
        this.enemies.forEach(enemy =>{
            enemy.update();
            this.player.projectiles.forEach(projectile => {
                if(this.checkCollision(enemy, projectile)) {
                    this.kill(enemy);
                    projectile.destroy();
                    this.score += enemy.scoreValue;
                    playScoreSound(this.gameComponent.user.userConfig.sound);
                    if(this.score >= 50){
                        this.gameComponent.end = true
                        this.gameComponent.stopAudio();
                        this.gameComponent.encryptAudio?.pause();
                        playSuccess(this.gameComponent.user.userConfig.sound)
                    }
                }
            });
        });
        this.enemies = this.enemies.filter(enemy => enemy.isAlive);
        if (this.enemies.length < 1) {
            this.addEnemy();
        }
    }

    private draw(ctx: CanvasRenderingContext2D): void {
        this.background.draw(ctx);
        this.Ui.draw(ctx);
        this.turtle.draw(ctx);
        this.player.draw(ctx);
        this.enemies.forEach(enemy=>{
            if (enemy instanceof Crab) {
                enemy.draw(ctx);
            } else if (enemy instanceof HiveCrab) {
                enemy.draw(ctx);
            } else if (enemy instanceof Drone) {
                enemy.draw(ctx);
            }
        });
    }

    private adjustCanvaResolution(): void {
        const scale = window.devicePixelRatio;
        this.canvas.width = this.canvas.clientWidth * scale;
        this.canvas.height = this.canvas.clientHeight * scale;
    }

    private startGameLoop(): void {
        const loop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.update();
            this.draw(this.ctx);
            requestAnimationFrame(loop);
        };
        loop();
    }
  }
