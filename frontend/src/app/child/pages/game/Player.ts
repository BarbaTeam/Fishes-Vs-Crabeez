import { UserID } from "@app/shared/models/ids";

export class Player {

    private _id: UserID;
    private x: number;
    private y: number;

    private width: number;
    private height: number;
    private _lane!: number;
    private hasChangedLane: boolean;

    private decryptedImage: HTMLImageElement;
    private encryptedImage: HTMLImageElement;

    private constructor(
        private canvas: HTMLCanvasElement,
        id : UserID,
    ) {
        this._id = id;
        this.x = this.canvas.width / 2 - 100;
        this.y = this.canvas.height - 200 - 100;
        this.width = 150;
        this.height = 150;
        this.hasChangedLane = true;

        this.decryptedImage = new Image();
        this.decryptedImage.src = "../../../../assets/images/game/player/yellow_fish.png";

        this.encryptedImage = new Image();
        this.encryptedImage.src = "../../../../assets/images/game/player/yellow_fish_encrypted.png";

    }

    public static fromJson(data: any, canvas : HTMLCanvasElement): Player {
        const player = new Player(canvas, data.id);
        player.lane = data.lane;
        return player;
    }

    public get id(): UserID {
        return this._id;
    }

    public get position() : { x: number, y: number } {
        return { x : this.x, y : this.y }
    }

    public set lane(value : number) {
        this._lane = value;
    }

    public update(): void {
        if(this.hasChangedLane) {
            switch(this.lane) {
                case 1:
                    this.x = 150;
                    this.y = (this.canvas.height + 400) - (this.canvas.height / 4) *2;
                    break;
                case 2:
                    this.x = 150;
                    this.y = (this.canvas.height  + 400) - (this.canvas.height / 4) *3;
                    break;
                case 3:
                    this.x = 150;
                    this.y = (this.canvas.height  + 400) - (this.canvas.height / 4) *4;
                    break;
                default:
                    break;
            }
             
            this.hasChangedLane = false;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.encryptedImage, -this.width / 2, -this.height / 2, this.width, this.height);
    }
}