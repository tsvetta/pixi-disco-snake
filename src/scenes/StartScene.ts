import { BitmapFont, BitmapText, Container, Graphics } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { GameScene } from "./GameScene";
import { RecordsScene } from "./RecordsScene";

export class StartScene extends Container implements IScene {
  private startButton: Graphics;

  private drawPageTitle() {
    BitmapFont.from("monotype", {
      fill: "#ffffff",
      fontFamily: "monospace",
      fontSize: 30,
    });

    const startTitle = new BitmapText("DISCO SNAKE", {
      fontName: "monotype",
      fontSize: 50,
      tint: 0x1fc95b,
    });

    startTitle.position.x = (Manager.width - startTitle.width) / 2;
    startTitle.position.y = 100;

    this.addChild(startTitle);

    return startTitle;
  }

  private drawStartButton(): [Graphics, BitmapText] {
    const startButton = new Graphics();
    const startButtonTitle = new BitmapText("PLAY", {
      fontName: "monotype",
      fontSize: 30,
      tint: 0x000000,
    });

    startButton.beginFill(0x1fc95b, 1);
    const startButtonWidth = Manager.width * 0.5;
    startButton.drawRect(0, 0, startButtonWidth, 50);
    startButton.endFill();

    this.addChild(startButton);
    startButton.addChild(startButtonTitle);

    startButton.interactive = true;
    startButton.cursor = "crosshair";

    startButton.x = (Manager.width - startButton.width) / 2;
    startButton.y = (Manager.height - startButton.height) / 2;

    startButtonTitle.x = (startButton.width - startButtonTitle.width) / 2;
    startButtonTitle.y = (startButton.height - startButtonTitle.height) / 2;

    startButton.on("click", this.gameLoad);
    startButton.on("tap", this.gameLoad);

    return [startButton, startButtonTitle];
  }

  private drawRecordsButton(): [Graphics, BitmapText] {
    const recordsButton = new Graphics();
    const recordsButtonTitle = new BitmapText("RECORDS", {
      fontName: "monotype",
      fontSize: 30,
      tint: 0x000000,
    });

    recordsButton.beginFill(0x1fc95b, 1);
    const recordsButtonWidth = Manager.width * 0.5;
    recordsButton.drawRect(0, 0, recordsButtonWidth, 50);
    recordsButton.endFill();

    this.addChild(recordsButton);
    recordsButton.addChild(recordsButtonTitle);

    recordsButton.interactive = true;
    recordsButton.cursor = "crosshair";

    recordsButton.x = (Manager.width - recordsButton.width) / 2;
    recordsButton.y = (Manager.height + this.startButton.height + 50) / 2;

    recordsButtonTitle.x = (recordsButton.width - recordsButtonTitle.width) / 2;
    recordsButtonTitle.y =
    (recordsButton.height - recordsButtonTitle.height) / 2;

    recordsButton.on("click", this.goToRecords);
    recordsButton.on("tap", this.goToRecords);

    return [recordsButton, recordsButtonTitle];
  }

  constructor() {
    super();

    this.drawPageTitle();
    this.startButton = this.drawStartButton()[0];
    this.drawStartButton()[1];
    this.drawRecordsButton()[0];
    this.drawRecordsButton()[1];
  }

  private gameLoad(): void {
    Manager.changeScene(new GameScene());
  }

  private goToRecords(): void {
    Manager.changeScene(new RecordsScene());
  }

  // @ts-ignore
  public update(framesPassed: number): void {}

  // @ts-ignore
  public resize(framesPassed: number): void {}
}
