import { BitmapFont, BitmapText, Container, Graphics } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { GameScene } from "./GameScene";

export class RecordsScene extends Container implements IScene {
  private recordsTitle: BitmapText;
  private recordsList: BitmapText;

  private drawPageTitle() {
    BitmapFont.from("monotype", {
      fill: "#ffffff",
      fontFamily: "monospace",
      fontSize: 30,
    });

    const recordsTitle = new BitmapText("RECORDS", {
      fontName: "monotype",
      fontSize: 50,
      tint: 0x1fc95b,
    });

    recordsTitle.position.x = (Manager.width - recordsTitle.width) / 2;
    recordsTitle.position.y = 50;

    this.addChild(recordsTitle);

    return recordsTitle;
  }

  private drawRecordsList(): BitmapText {
    BitmapFont.from("monotype", {
      fill: "#ffffff",
      fontFamily: "monospace",
      fontSize: 30,
    });

    const recordList = new BitmapText("blabla", {
      fontName: "monotype",
      fontSize: 50,
      tint: 0xffffff,
    });

    recordList.position.x = (Manager.width - recordList.width) / 2;
    recordList.position.y = (Manager.height + this.recordsTitle.height) / 2;

    this.addChild(recordList);

    return recordList;
  }

  private drawPlayButton(): [Graphics, BitmapText] {
    const playButton = new Graphics();
    const playButtonTitle = new BitmapText("PLAY", {
      fontName: "monotype",
      fontSize: 30,
      tint: 0x000000,
    });

    playButton.beginFill(0x1fc95b, 1);
    const playButtonWidth = Manager.width * 0.5;
    playButton.drawRect(0, 0, playButtonWidth, 50);
    playButton.endFill();

    this.addChild(playButton);
    playButton.addChild(playButtonTitle);

    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.cursor = "crosshair";

    playButton.x = (Manager.width - playButton.width) / 2;
    playButton.y = Manager.height - 70;

    playButtonTitle.x = (playButton.width - playButtonTitle.width) / 2;
    playButtonTitle.y =
      (playButton.height - playButtonTitle.height) / 2;

    playButton.on("click", this.gameLoad);
    playButton.on("tap", this.gameLoad);

    return [playButton, playButtonTitle];
  }

  constructor() {
    super();

    this.recordsTitle = this.drawPageTitle();
    this.recordsList = this.drawRecordsList();
    this.drawPlayButton();
  }

  private gameLoad(): void {
    Manager.changeScene(new GameScene());
  }

  // @ts-ignore
  public update(framesPassed: number): void {}

  // @ts-ignore
  public resize(framesPassed: number): void {}
}
