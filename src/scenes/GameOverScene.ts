import { BitmapFont, BitmapText, Container } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { RecordsScene } from "./RecordsScene";

export class GameOverScene extends Container implements IScene {
  private drawPageTitle() {
    BitmapFont.from("monotype", {
      fill: "#ffffff",
      fontFamily: "monospace",
      fontSize: 30,
    });

    const startTitle = new BitmapText("GAME OVER", {
      fontName: "monotype",
      fontSize: 80,
      tint: 0xed0c0c,
    });

    startTitle.position.x = (Manager.width - startTitle.width) / 2;
    startTitle.position.y = (Manager.height - startTitle.width) / 2;

    this.addChild(startTitle);

    return startTitle;
  }

  constructor() {
    super();

    this.drawPageTitle();

    setTimeout(() => {
      this.goToRecords();
    }, 3000);
  }

  private goToRecords(): void {
    Manager.changeScene(new RecordsScene());
  }

  // @ts-ignore
  public update(framesPassed: number): void {}

  // @ts-ignore
  public resize(framesPassed: number): void {}
}
