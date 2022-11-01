import { Container, Sprite } from "pixi.js";
import { IScene, Manager } from "../Manager";

export class GameScene extends Container implements IScene {
    private disco: Sprite;
    private discoVelocity: number;
    constructor() {
        super();

        this.disco = Sprite.from("disco ball 1");

        this.disco.anchor.set(0.5);
        this.disco.x = Manager.width / 2;
        this.disco.y = Manager.height / 2;
        this.addChild(this.disco);

        this.discoVelocity = 5;
    }

    public update(framesPassed: number): void {
        // Lets move disco!
        this.disco.x += this.discoVelocity * framesPassed;

        if (this.disco.x > Manager.width) {
            this.disco.x = Manager.width;
            this.discoVelocity = -this.discoVelocity;
        }

        if (this.disco.x < 0) {
            this.disco.x = 0;
            this.discoVelocity = -this.discoVelocity;
        }
    }

    // @ts-ignore
    public resize(w: number, h: number): void {}
}
