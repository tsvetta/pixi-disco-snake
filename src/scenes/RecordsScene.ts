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
    recordsTitle.position.y = 100;

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

  private drawRecordsButton(): [Graphics, BitmapText] {
    const recordsButton = new Graphics();
    const recordsButtonTitle = new BitmapText("PLAY", {
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
    recordsButton.y = Manager.height - 200;

    recordsButtonTitle.x = (recordsButton.width - recordsButtonTitle.width) / 2;
    recordsButtonTitle.y =
      (recordsButton.height - recordsButtonTitle.height) / 2;

    recordsButton.on("click", this.gameLoad);

    return [recordsButton, recordsButtonTitle];
  }

  constructor() {
    super();

    this.recordsTitle = this.drawPageTitle();
    this.recordsList = this.drawRecordsList();
    this.drawRecordsButton();
  }

  private gameLoad(): void {
    Manager.changeScene(new GameScene());
  }

  // @ts-ignore
  public update(framesPassed: number): void {}

  // @ts-ignore
  public resize(framesPassed: number): void {}
}
