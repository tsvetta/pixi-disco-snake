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

const DEFAULT_SPEED = 50;

const drawGrid = (w: number, h: number) => {
  const grid = new Graphics();
  const topPadding = 4;
  const sidesPadding = 1;

  grid.x = CELL_SIZE;
  grid.y = CELL_SIZE * topPadding;
  grid.tint = 0x00ff00;

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
  public direction: Direction = "right";
  private disco: Sprite;
  // private discoTween: Tween<ObservablePoint>;
  private grid: Graphics = drawGrid(Manager.width, Manager.height);
  private discoJumpLength: number = CELL_SIZE;

  private move(direction: Direction) {
    switch (direction) {
      case "top": {
        this.disco.y -= this.discoJumpLength;

        if (this.disco.y < 0) {
          this.disco.y = Manager.height;
        }
        break;
      }

      case "right": {
        this.disco.x += this.discoJumpLength;

        if (this.disco.x > Manager.width) {
          this.disco.x = 0;
        }

        break;
      }

      case "left": {
        this.disco.x -= this.discoJumpLength;

        if (this.disco.x < 0) {
          this.disco.x = Manager.width;
        }
        break;
      }

      case "bottom": {
        this.disco.y += this.discoJumpLength;

        if (this.disco.y > Manager.height) {
          this.disco.y = 0;
        }

        break;
      }
    }
  }

  constructor() {
    super();

    this.disco = Sprite.from("disco ball 1");

    this.disco.x = CELL_SIZE * 10;
    this.disco.y = CELL_SIZE * 10;
    this.disco.height = CELL_SIZE;
    this.disco.width = CELL_SIZE;

    this.addChild(this.disco);

    // this.discoTween = new Tween(this.disco.scale)
    //   .to({ x: 0.4, y: 0.4 }, 500)
    //   .repeat(Infinity)
    //   .yoyo(true)
    //   .start();

    Manager.stage.addChild(this.grid);
    Manager.changeSpeed(DEFAULT_SPEED);

    document.addEventListener("keydown", this.changeDirection);
  }

  private changeDirection(e: KeyboardEvent): void {
    switch (true) {
      case keyCodeMap.top.includes(e.code): {
        this.direction = "top"; // нужно ли?
        Manager.changeSpeedDelta(0);
        this.move('top');
        break;
      }

      case keyCodeMap.right.includes(e.code): {
        this.direction = "right";
        Manager.changeSpeedDelta(0);
        this.move('right');
        break;
      }

      case keyCodeMap.bottom.includes(e.code): {
        this.direction = "bottom";
        Manager.changeSpeedDelta(0);
        this.move('bottom');
        break;
      }

      case keyCodeMap.left.includes(e.code): {
        this.direction = "left";
        Manager.changeSpeedDelta(0);
        this.move('left');
        break;
      }
    }
  }

  public maxDelta = 30;

  // Lets disco!
  public update(): void {
    switch (this.direction) {
      case "top":
        this.move('top');
        break;
      case "right":
        this.move('right');
        break;
      case "left":
        this.move('left');
        break;
      case "bottom":
        this.move('bottom');
        break;
      default:
        break;
    }
  }

  public resize(w: number, h: number): void {
    this.grid.destroy();
    this.grid = drawGrid(w, h);
    Manager.stage.addChild(this.grid);
  }
}
