import { Enemy } from "./Enemy";
import { Crab } from "./Crab";

import { GameComponent } from "./game.component";
import { Player } from "./Player";
import { HiveCrab } from "./HiveCrab";
import { Drone } from "./Drone";
import { Ui } from "./Ui";

export class GameEngine {
    private ctx: CanvasRenderingContext2D;
    private player : Player;
    private Ui: Ui;
    private score: number = 0;
    private enemies: Enemy[];

    constructor(private gameComponent: GameComponent, private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.adjustCanvaResolution();
        this.player = new Player(this, canvas);
        this.enemies = [new Crab(this, canvas)];
        this.Ui = new Ui(this, canvas);
        this.score = 0;
        this.startGameLoop();
    }

    public answerCorrectly(): void {
        if(this.closestEnemy){
            this.player.shoot();
        }
    }
    public get scoreValue(): number {
        return this.score;
    }

    public get playerPosition(): {x:number, y:number} {
        return this.player.position;
    }

    public get closestEnemy(): Enemy | undefined {
        if(!this.enemies[0]){
            return undefined;
        }
        let closest = this.enemies[0];
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
            this.enemies.push(new Drone(this,this.canvas, enemy.position.x, enemy.position.y), new Drone(this,this.canvas, enemy.position.x+40, enemy.position.y-40), new Drone(this,this.canvas, enemy.position.x-50, enemy.position.y));
        }
        enemy.destroy();
    }

    private addEnemy(): void {
        let newEnemy = Math.random() > 0.3 ? new Crab(this,this.canvas) : new HiveCrab(this, this.canvas);
        this.enemies.push(newEnemy);
    }

    private update(): void {
        this.player.update();
        this.enemies.forEach(enemy =>{
            enemy.update();
            this.player.projectiles.forEach(projectile => {
                if(this.checkCollision(enemy, projectile)) {
                    this.kill(enemy);
                    projectile.destroy();
                    this.score += enemy.scoreValue;
                }
            });
        });
        this.enemies = this.enemies.filter(enemy => enemy.isAlive);
        if (this.enemies.length < 1) {
            this.addEnemy();
        }
    }

    private draw(ctx: CanvasRenderingContext2D): void {
        this.Ui.draw(ctx);
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
        };
        setInterval(loop, 10);
    }
  }
