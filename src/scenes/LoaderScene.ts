import { BitmapFont, BitmapText, Container, Graphics, Loader } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { GameScene } from "./GameScene";

export const discoAssets = [
  { name: "disco ball 1", url: "disco/discoball_1.png" },
  { name: "disco ball 2", url: "disco/discoball_2.png" },
  { name: "disco ball 3", url: "disco/discoball_3.png" },
  { name: "disco ball 4", url: "disco/discoball_4.png" },
]

export class LoaderScene extends Container implements IScene {
    // for making our loader graphics...
    private loaderTitle: BitmapText;
    private loaderBar: Container;
    private loaderBarBoder: Graphics;
    private loaderBarFill: Graphics;
    constructor() {
        super();

        const loaderBarWidth = Manager.width * 0.8;

        this.loaderBarFill = new Graphics();
        this.loaderBarFill.beginFill(0x1fc95b, 1)
        this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 50);
        this.loaderBarFill.endFill();
        this.loaderBarFill.scale.x = 0;

        this.loaderBarBoder = new Graphics();
        this.loaderBarBoder.lineStyle(2, 0x0, 1);
        this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 50);

        this.loaderBar = new Container();
        this.loaderBar.addChild(this.loaderBarFill);
        this.loaderBar.addChild(this.loaderBarBoder);
        this.loaderBar.position.x = (Manager.width - this.loaderBar.width) / 2;
        this.loaderBar.position.y = (Manager.height - this.loaderBar.height) / 2;
        this.addChild(this.loaderBar);

        BitmapFont.from('monotype', {
            fill: '#ffffff',
            fontFamily: 'monospace',
            fontSize: 30,
        }, { chars: BitmapFont.ASCII});

        this.loaderTitle = new BitmapText('Loading...', {
            fontName: 'monotype',
            fontSize: 30,
            tint: 0x1fc95b,
        });

        this.loaderTitle.position.x = (Manager.width - this.loaderTitle.width) / 2;
        this.loaderTitle.position.y = this.loaderBar.position.y - this.loaderBar.height;

        this.addChild(this.loaderTitle)

        Loader.shared.add(discoAssets);

        Loader.shared.onProgress.add(this.downloadProgress, this);
        Loader.shared.onComplete.once(this.gameLoaded, this);

        Loader.shared.load();
    }

    private downloadProgress(loader: Loader): void {
        const progressRatio = loader.progress / 100;
        this.loaderBarFill.scale.x = progressRatio;
    }

    private gameLoaded(): void {
        // Change scene to the game scene!
        Manager.changeScene(new GameScene());
    }

    // @ts-ignore
    public update(framesPassed: number): void {
        // To be a scene we must have the update method even if we don't use it.
    }
}
