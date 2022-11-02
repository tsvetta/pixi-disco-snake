import { BitmapFont, BitmapText, Container, Graphics } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { GameScene } from "./GameScene";

export class RecordsScene extends Container implements IScene {
    // for making our loader graphics...
    private startTitle: BitmapText;
    private startButton: Graphics;
    private buttonTitle: BitmapText;

    constructor() {
        super();

        // Add loader title
        BitmapFont.from('monotype', {
            fill: '#ffffff',
            fontFamily: 'monospace',
            fontSize: 30,
        });

        this.startTitle = new BitmapText('RECORDS', {
            fontName: 'monotype',
            fontSize: 30,
            tint: 0x1fc95b,
        });

        this.startTitle.position.x = (Manager.width - this.startTitle.width) / 2;
        this.startTitle.position.y = 100;

        this.addChild(this.startTitle);

        const buttonWidth = Manager.width * 0.5;

        this.startButton = new Graphics();
        this.startButton.beginFill(0x1fc95b, 1);
        this.startButton.drawRect(0, 0, buttonWidth, 50);
        this.startButton.endFill();
        this.startButton.x = (Manager.width - this.startButton.width) / 2;
        this.startButton.y = (Manager.height - this.startButton.height) / 2;

        this.addChild(this.startButton)

        this.buttonTitle = new BitmapText('Records', {
          fontName: 'monotype',
          fontSize: 30,
          tint: 0x000000,
      });

      this.buttonTitle.x = (this.startButton.width - this.buttonTitle.width) / 2;
      this.buttonTitle.y = (this.startButton.height - this.buttonTitle.height) / 2;

      this.startButton.addChild(this.buttonTitle);

      this.startButton.interactive = true;
      this.startButton.cursor = 'crosshair';

      this.startButton.on('click', this.gameLoad);
    }

    private gameLoad(): void {
        Manager.changeScene(new GameScene());
    }

    // @ts-ignore
    public update(framesPassed: number): void {}

    // @ts-ignore
    public resize(framesPassed: number): void {}
}
