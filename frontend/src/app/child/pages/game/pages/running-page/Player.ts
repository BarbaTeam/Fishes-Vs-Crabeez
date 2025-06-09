import { UserID } from "@app/shared/models/ids";
import { scaleToCanvas } from "./utils"; 

export class Player {
    private _id: UserID;
    public x!: number;
    public y!: number;
    private virtualWidth: number;
    private virtualHeight: number;
    private decryptedImage: HTMLImageElement;
    public playerIconUrl!: string;
    private encryptedImage: HTMLImageElement;
    public paralysed: boolean = false;
    public color!: string;

    private constructor(private canvas: HTMLCanvasElement, id: UserID) {
        this._id = id;

        this.virtualWidth = 5;
        this.virtualHeight = 5;

        this.decryptedImage = new Image();
        this.encryptedImage = new Image();
    }

    public static fromJSON(data: any, localPlayerId: UserID, canvas: HTMLCanvasElement): Player {
        const player = new Player(canvas, data.id);
        player.x = data.x;
        player.y = data.y;
        player.color = data.color;
        if(data.id === localPlayerId) {
            player.decryptedImage.src = `../../../../assets/images/game/player/${ player.color}_fish_active.png`;
        } else {
            player.decryptedImage.src = `../../../../assets/images/game/player/${ player.color}_fish.png`;
        }
        player.playerIconUrl = `../../../../assets/images/game/player/${ player.color}_fish.png`;
        player.encryptedImage.src =  `../../../../assets/images/game/player/${ player.color}_fish_encrypted.png`;
        return player;
    }

    public get id(): UserID {
        return this._id;
    }

    public get position(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const now = performance.now();
        const oscillation = Math.sin(now / 300 + this.x) * 3; // pour que chaque poisson ai une oscillation différente
        const playerImage = this.paralysed ? this.encryptedImage : this.decryptedImage;
        
        const { x, y, width, height } = scaleToCanvas(
            this.x,
            this.y,
            this.virtualWidth,
            this.virtualHeight,
            this.canvas,
            playerImage,
        );

        ctx.save(); 
        ctx.translate(0, oscillation);

        ctx.drawImage(playerImage, x, y, width, height);

        ctx.restore(); 
    }
}
