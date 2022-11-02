import { Container, Graphics, ObservablePoint, Sprite } from "pixi.js";
import { Tween } from "tweedle.js";

import { IScene, Manager } from "../Manager";

const CELL_SIZE = 30;

type KeyCodes = {
  top: string[];
  right: string[];
  bottom: string[];
  left: string[];
};

const keyCodeMap: KeyCodes = {
  top: ["ArrowUp", "KeyW"],
  right: ["ArrowRight", "KeyD"],
  bottom: ["ArrowDown", "KeyS"],
  left: ["ArrowLeft", "KeyA"],
};

const drawGrid = (w: number, h: number) => {
  const grid = new Graphics();
  const topPadding = 4;
  const sidesPadding = 1;

  grid.x = CELL_SIZE;
  grid.y = CELL_SIZE * topPadding;
  grid.tint = 0x00ff00;

  console.log(grid);

  grid.beginFill();

  const lineHeightLeftover = h % CELL_SIZE;
  const actualLineHeight = h - lineHeightLeftover;
  const horizontalLines = actualLineHeight / CELL_SIZE - topPadding;

  const lineWidthLeftover = w % CELL_SIZE;
  const actualLineWidth = w - lineWidthLeftover;
  const verticalLines = actualLineWidth / CELL_SIZE - sidesPadding;

  grid.lineStyle(1, 0x141414);

  for (let i = 0; i <= horizontalLines; i++) {
    const nextLinePosition = 0 + i * CELL_SIZE;
    const horizontalLineWidth =
      actualLineWidth - CELL_SIZE * (sidesPadding * 2);

    grid.drawRect(0, nextLinePosition, horizontalLineWidth, 1);
  }

  for (let i = 0; i < verticalLines; i++) {
    const nextLinePosition = 0 + i * CELL_SIZE;
    const verticalLineHeight =
      actualLineHeight - CELL_SIZE * topPadding - sidesPadding;

    grid.drawRect(nextLinePosition, 0, 1, verticalLineHeight);
  }

  grid.endFill();

  return grid;
};

type Direction = "left" | "right" | "top" | "bottom";
export class GameScene extends Container implements IScene {
  public static direction: Direction = "right";

  public static disco: Sprite;
  public static discoTween: Tween<ObservablePoint>;
  private grid: Graphics = drawGrid(Manager.width, Manager.height);
  public static discoVelocity: number = CELL_SIZE;

  public static moveTop() {
    GameScene.disco.y -= GameScene.discoVelocity;

    if (GameScene.disco.y < 0) {
      GameScene.disco.y = Manager.height;
    }
  }

  public static moveRight() {
    GameScene.disco.x += GameScene.discoVelocity;

    if (GameScene.disco.x > Manager.width) {
      GameScene.disco.x = 0;
    }
  }

  public static moveLeft() {
    GameScene.disco.x -= GameScene.discoVelocity;

    if (GameScene.disco.x < 0) {
      GameScene.disco.x = Manager.width;
    }
  }

  public static moveBottom() {
    GameScene.disco.y += GameScene.discoVelocity;

    if (GameScene.disco.y > Manager.height) {
      GameScene.disco.y = 0;
    }
  }

  constructor() {
    super();

    GameScene.disco = Sprite.from("disco ball 1");

    GameScene.disco.x = CELL_SIZE * 10;
    GameScene.disco.y = CELL_SIZE * 10;
    GameScene.disco.height = CELL_SIZE;
    GameScene.disco.width = CELL_SIZE;

    this.addChild(GameScene.disco);

    GameScene.discoTween = new Tween(GameScene.disco.scale)
      .to({ x: 0.4, y: 0.4 }, 500)
      .repeat(Infinity)
      .yoyo(true)
      .start();

    Manager.stage.addChild(this.grid);

    document.addEventListener("keydown", this.changeDirection);
  }

  private changeDirection(e: KeyboardEvent): void {
    switch (true) {
      case keyCodeMap.top.includes(e.code): {
        GameScene.direction = "top"; // нужно ли?
        GameScene.moveTop();

        break;
      }

      case keyCodeMap.right.includes(e.code): {
        GameScene.direction = "right";
        GameScene.moveRight();
        break;
      }

      case keyCodeMap.bottom.includes(e.code): {
        GameScene.direction = "bottom";
        GameScene.moveBottom();
        break;
      }

      case keyCodeMap.left.includes(e.code): {
        GameScene.direction = "left";
        GameScene.moveLeft();
        break;
      }
    }
  }

  // Lets disco!
  public update(): void {
    // switch (GameScene.direction) {
    //   case "top":
    //     this.moveTop();
    //     break;
    //   case "right":
    //     this.moveRight();
    //     break;
    //   case "left":
    //     this.moveLeft();
    //     break;
    //   case "bottom":
    //     this.moveBottom();
    //     break;
    //   default:
    //     break;
    // }
  }

  public resize(w: number, h: number): void {
    this.grid.destroy();
    this.grid = drawGrid(w, h);
    Manager.stage.addChild(this.grid);
  }
}
