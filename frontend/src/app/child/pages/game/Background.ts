import { GameEngine } from "./game-engine";
import { Layer } from "./Layer";

export class Background{
    private image1: HTMLImageElement;
    private layer1: Layer;
    private layers: Layer[];

    constructor(
        private gameEngine: GameEngine,
        private canvas: HTMLCanvasElement
    ) {
        this.gameEngine = gameEngine;
        this.image1 = document.getElementById("layer1") as HTMLImageElement;
        this.layer1 = new Layer(gameEngine, canvas, this.image1, 0.5);
        this.layers = [this.layer1];
    }

    update(): void {
        this.layers.forEach(layer => {
            layer.update();
        });
    }
    draw(ctx: CanvasRenderingContext2D): void {
        this.layers.forEach(layer => {
            layer.draw(ctx);
        });
    }
}