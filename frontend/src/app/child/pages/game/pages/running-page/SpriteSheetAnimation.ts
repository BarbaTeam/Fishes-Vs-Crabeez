export class SpriteSheetAnimation {
    private frameWidth: number = 0;
    private frameHeight: number = 0;
    private currentFrame: number = 0;
    private frameCounter: number = 0;

    constructor(
        public image: HTMLImageElement,
        private totalFrames: number,
        private frameDelay: number = 5,
    ) {
        this.image.onload = () => {
            this.frameWidth = this.image.width / this.totalFrames;
            this.frameHeight = this.image.height;
        };
    }

    public set imageUrl(url: string) {
        this.image.src = url;
    }

    public update(): void {
        this.frameCounter++;
        if (this.frameCounter >= this.frameDelay) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }
    }

    public draw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        const sx = this.currentFrame * this.frameWidth;
        ctx.drawImage(
            this.image,
            sx, 0,
            this.frameWidth, this.frameHeight,
            x, y,
            width, height
        );
    }

    public reset(): void {
        this.currentFrame = 0;
        this.frameCounter = 0;
    }

    public isFinished(): boolean {
        return this.currentFrame >= this.totalFrames - 1;
    }
}
