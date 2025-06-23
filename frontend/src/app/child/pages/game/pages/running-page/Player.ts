import { UserID } from "@app/shared/models/ids";
import { scaleToCanvas } from "./scale-utils"; 

export class Player {
    private _id: UserID;

    private virtualX: number;
    private virtualY!: number;
    private virtualWidth: number;
    private virtualHeight: number;

    private _lane!: number;

    private decryptedImage: HTMLImageElement;
    private encryptedImage: HTMLImageElement;


    constructor(private canvas: HTMLCanvasElement, id: UserID, ) {
        this._id = id;

        this.virtualX = 5;
        this.virtualWidth = 5;
        this.virtualHeight = 5;

        this.decryptedImage = new Image();
        this.encryptedImage = new Image();
    }

    public static fromJSON(data: any, canvas: HTMLCanvasElement): Player {
        const player = new Player(canvas, data.id);
        player.lane = data.lane;

        player.encryptedImage.src =  `../../../../assets/images/game/player/${data.color}_fish_encrypted.png`;
        player.decryptedImage.src = `../../../../assets/images/game/player/${data.color}_fish.png`;

        player.update();
        return player;
    }

    public get id(): UserID {
        return this._id;
    }

    public get position(): { x: number, y: number } {
        return { x: this.virtualX, y: this.virtualY };
    }

    public set lane(value: number) {
        this._lane = value;
    }

    public get lane(): number {
        return this._lane;
    }

    public update(): void {
        switch (this.lane) {
            case 1:
                this.virtualY = 49;
                break;
            case 2:
                this.virtualY = 33;
                break;
            case 3:
                this.virtualY = 17;
                break;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const { x, y, width, height } = scaleToCanvas(
            this.virtualX,
            this.virtualY,
            this.virtualWidth,
            this.virtualHeight,
            this.canvas
        );

        ctx.drawImage(this.decryptedImage, x, y, width, height);
    }
}
