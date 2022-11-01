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

  const space = CELL_SIZE;
  const width = CELL_SIZE;

  grid.beginFill(0x141414);


  const verticalLines = Math.ceil(w / CELL_SIZE) + 1;
  const horizontalLines = Math.ceil(h / CELL_SIZE) + 1;

  console.log(verticalLines, horizontalLines, w, h);

  for (let i = 0; i < horizontalLines; i++) {
    const x1 = 0;
    const y1 = i * space;
    const width1 = width * width * width;
    const height1 = 1;

    grid.drawRect(x1, y1, width1, height1);
  }

  for (let i = 0; i < verticalLines; i++) {
    const x2 = i * space;
    const y2 = 0;
    const width2 = 1;
    const height2 = width * width * width;

    grid.drawRect(x2, y2, width2, height2);
  }

  grid.endFill();

  return grid;
};

type Direction = "left" | "right" | "top" | "bottom";
export class GameScene extends Container implements IScene {
  public static direction: Direction = 'right';

  private disco: Sprite;
  private discoTween: Tween<ObservablePoint>;
  private grid: Graphics = drawGrid(Manager.width, Manager.height);
  private discoVelocity: number = 5;

  private moveTop() {
    this.disco.y -= this.discoVelocity;

    if (this.disco.y < 0) {
      this.disco.y = Manager.height;
    }
  }

  private moveRight() {
    this.disco.x += this.discoVelocity;

    if (this.disco.x > Manager.width) {
      this.disco.x = 0;
    }
  }

  private moveLeft() {
    this.disco.x -= this.discoVelocity;

    if (this.disco.x < 0) {
      this.disco.x = Manager.width;
    }
  }

  private moveBottom() {
    this.disco.y += this.discoVelocity;

    if (this.disco.y > Manager.height) {
      this.disco.y = 0;
    }
  }

  private changeDirection(e: KeyboardEvent): void {
    console.log(e.code, GameScene.direction);
    switch (true) {
      case keyCodeMap.top.includes(e.code): {
        GameScene.direction = "top"; // не влияет на update??
        break;
      }

      case keyCodeMap.right.includes(e.code): {
        GameScene.direction = "right";
        break;
      }

      case keyCodeMap.bottom.includes(e.code): {
        GameScene.direction = "bottom";
        break;
      }

      case keyCodeMap.left.includes(e.code): {
        GameScene.direction = "left";
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

    this.discoTween = new Tween(this.disco.scale)
      .to({ x: 0.4, y: 0.4 }, 500)
      .repeat(Infinity)
      .yoyo(true)
      .start();

    Manager.stage.addChild(this.grid);

    document.addEventListener("keydown", this.changeDirection);
  }

  // Lets disco!
  public update(): void {
    switch (GameScene.direction) {
      case "top":
        this.moveTop();
        break;

      case "right":
        this.moveRight();
        break;

      case "left":
        this.moveLeft();
        break;

      case "bottom":
        this.moveBottom();
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
