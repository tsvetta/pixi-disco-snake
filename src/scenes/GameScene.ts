import { BitmapText, Container, Graphics, Sprite } from "pixi.js";
import { Tween } from "tweedle.js";

import { IScene, Manager } from "../Manager";
import { GameOverScene } from "./GameOverScene";
import {
  bootyGlowFilter,
  boundaries,
  CELL_SIZE,
  DEFAULT_SPEED,
  drawGrid,
  generateBootyData,
  getCoordsFromSnake,
  keyCodeMap,
} from "./helpers";
import { RecordsScene } from "./RecordsScene";

import { Direction, SnakeData } from "./snake-types";

export class GameScene extends Container implements IScene {
  public direction: Direction = "top";
  private discoSnake: SnakeData[];
  private bootyData = generateBootyData();
  // @ts-ignore
  private animatedBooty: Tween<ObservablePoint<any>>;

  private discoBooty: Sprite = this.bootyData.booty;
  private grid: Graphics = drawGrid(Manager.width, Manager.height);
  private level: number = 0;
  private points: number = 0;

  private pointsCounter = new BitmapText(`${this.points}`, {
    fontName: "monotype",
    fontSize: 30,
    tint: 0xffffff,
  });
  private levelsCounter = new BitmapText(`${this.level}`, {
    fontName: "monotype",
    fontSize: 30,
    tint: 0xffffff,
  });

  private move = (direction: Direction) => {
    switch (direction) {
      case "top": {
        if (this.direction === "bottom") break; // can't go backwards

        Manager.changeSpeedDelta(0); // to prevent jumping after pressing the key

        this.direction = "top";

        for (let i = this.discoSnake.length - 1; i >= 0; i--) {
          const oldCoords = getCoordsFromSnake(this.discoSnake[i].coords);

          // if first unit on edge
          if (i === 0 && this.discoSnake[i].snakeUnit.y <= boundaries.topEdge) {
            this.discoSnake[i].snakeUnit.y = boundaries.ypxEnd;

            const newY = boundaries.bottomY;
            this.discoSnake[i].coords = `${oldCoords[0]},${newY}`;
            continue;
          }

          // if first unit
          if (i === 0) {
            this.discoSnake[i].snakeUnit.y =
              this.discoSnake[i].snakeUnit.y - CELL_SIZE;
            this.discoSnake[i].coords = `${oldCoords[0]},${oldCoords[1] - 1}`;
          } else {
            this.discoSnake[i].snakeUnit.x = this.discoSnake[i - 1].snakeUnit.x;
            this.discoSnake[i].snakeUnit.y = this.discoSnake[i - 1].snakeUnit.y;
            this.discoSnake[i].coords = this.discoSnake[i - 1].coords;
          }
        }

        break;
      }

      case "right": {
        if (this.direction === "left") break; // can't go backwards

        Manager.changeSpeedDelta(0); // to prevent jumping after pressing the key

        this.direction = "right";

        for (let i = this.discoSnake.length - 1; i >= 0; i--) {
          const oldCoords = getCoordsFromSnake(this.discoSnake[i].coords);

          // if first unit on edge
          if (
            i === 0 &&
            this.discoSnake[i].snakeUnit.x > boundaries.rightEdge
          ) {
            this.discoSnake[i].snakeUnit.x = CELL_SIZE;

            const newX = boundaries.leftX;
            this.discoSnake[i].coords = `${newX},${oldCoords[1]}`;
            continue;
          }

          // if first unit
          if (i === 0) {
            this.discoSnake[i].snakeUnit.x =
              this.discoSnake[i].snakeUnit.x + CELL_SIZE;
            this.discoSnake[i].coords = `${oldCoords[0] + 1},${oldCoords[1]}`;
          } else {
            this.discoSnake[i].snakeUnit.x = this.discoSnake[i - 1].snakeUnit.x;
            this.discoSnake[i].snakeUnit.y = this.discoSnake[i - 1].snakeUnit.y;
            this.discoSnake[i].coords = this.discoSnake[i - 1].coords;
          }
        }

        break;
      }

      case "left": {
        if (this.direction === "right") break; // can't go backwards

        Manager.changeSpeedDelta(0); // to prevent jumping after pressing the key

        this.direction = "left";

        for (let i = this.discoSnake.length - 1; i >= 0; i--) {
          const oldCoords = getCoordsFromSnake(this.discoSnake[i].coords);

          // if first unit on edge
          if (
            i === 0 &&
            this.discoSnake[i].snakeUnit.x <= boundaries.leftEdge
          ) {
            this.discoSnake[i].snakeUnit.x = boundaries.xpxEnd;

            const newX = boundaries.rightX;
            this.discoSnake[i].coords = `${newX},${oldCoords[1]}`;
            continue;
          }

          // if first unit
          if (i === 0) {
            this.discoSnake[i].snakeUnit.x =
              this.discoSnake[i].snakeUnit.x - CELL_SIZE;
            this.discoSnake[i].coords = `${oldCoords[0] - 1},${oldCoords[1]}`;
          } else {
            this.discoSnake[i].snakeUnit.x = this.discoSnake[i - 1].snakeUnit.x;
            this.discoSnake[i].snakeUnit.y = this.discoSnake[i - 1].snakeUnit.y;
            this.discoSnake[i].coords = this.discoSnake[i - 1].coords;
          }
        }

        break;
      }

      case "bottom": {
        if (this.direction === "top") break; // can't go backwards

        Manager.changeSpeedDelta(0); // to prevent jumping after pressing the key

        this.direction = "bottom";

        for (let i = this.discoSnake.length - 1; i >= 0; i--) {
          const oldCoords = getCoordsFromSnake(this.discoSnake[i].coords);

          // if first unit on edge
          if (
            i === 0 &&
            this.discoSnake[i].snakeUnit.y > boundaries.bottomEdge
          ) {
            this.discoSnake[i].snakeUnit.y = CELL_SIZE * 4;

            const newY = boundaries.topY;
            this.discoSnake[i].coords = `${oldCoords[0]},${newY}`;
            continue;
          }

          // if first unit
          if (i === 0) {
            this.discoSnake[i].snakeUnit.y =
              this.discoSnake[i].snakeUnit.y + CELL_SIZE;
            this.discoSnake[i].coords = `${oldCoords[0]},${oldCoords[1] + 1}`;
          } else {
            this.discoSnake[i].snakeUnit.x = this.discoSnake[i - 1].snakeUnit.x;
            this.discoSnake[i].snakeUnit.y = this.discoSnake[i - 1].snakeUnit.y;
            this.discoSnake[i].coords = this.discoSnake[i - 1].coords;
          }
        }

        break;
      }
    }
  };

  private createNewBooty = () => {
    this.bootyData = generateBootyData(this.discoSnake);
    this.discoBooty = this.bootyData.booty;

    this.addChild(this.discoBooty);

    this.discoBooty.height = CELL_SIZE;
    this.discoBooty.width = CELL_SIZE;
    this.discoBooty.x = this.bootyData.xCellpx;
    this.discoBooty.y = this.bootyData.yCellpx;
    this.discoBooty.anchor.set(0.5);

    // animate booty
    this.animatedBooty = new Tween(this.discoBooty.scale)
      .to({ x: 0.6, y: 0.6 }, 2000)
      .repeat(Infinity)
      .yoyo(true)
      .start();
  };

  private drawRecordsButton = () => {
    const recordsButton = new Graphics();
    const recordsButtonTitle = new BitmapText("RECORDS", {
      fontName: "monotype",
      fontSize: 30,
      tint: 0x000000,
    });

    recordsButton.beginFill(0x1fc95b, 1);
    const recordsButtonWidth = 300;
    recordsButton.drawRect(0, 0, recordsButtonWidth, 50);
    recordsButton.endFill();

    this.addChild(recordsButton);
    recordsButton.addChild(recordsButtonTitle);

    recordsButton.interactive = true;
    recordsButton.cursor = "crosshair";

    recordsButton.x = Manager.width - recordsButton.width - CELL_SIZE;
    recordsButton.y = CELL_SIZE;

    recordsButtonTitle.x = (recordsButton.width - recordsButtonTitle.width) / 2;
    recordsButtonTitle.y =
      (recordsButton.height - recordsButtonTitle.height) / 2;

    recordsButton.on("click", this.goToRecords);
    recordsButton.on("tap", this.goToRecords);
  };

  private drawPointsCounter = () => {
    const pointsText = new BitmapText("POINTS:", {
      fontName: "monotype",
      fontSize: 30,
      tint: 0x00ff00,
    });

    this.addChild(pointsText);
    this.addChild(this.pointsCounter);

    pointsText.x = CELL_SIZE;
    pointsText.y = CELL_SIZE;

    this.pointsCounter.x = pointsText.width + 50;
    this.pointsCounter.y = CELL_SIZE;
  };

  private drawLevelCounter = () => {
    const levelsText = new BitmapText("LEVEL:", {
      fontName: "monotype",
      fontSize: 30,
      tint: 0x00ff00,
    });

    this.addChild(levelsText);
    this.addChild(this.levelsCounter);

    levelsText.x = CELL_SIZE + 500;
    levelsText.y = CELL_SIZE;

    this.levelsCounter.x = levelsText.width + 550;
    this.levelsCounter.y = CELL_SIZE;
  };

  constructor() {
    super();

    this.drawRecordsButton();
    this.drawPointsCounter();
    this.drawLevelCounter();

    this.discoSnake = [
      { snakeUnit: Sprite.from("Harry"), coords: "10,10" },
      { snakeUnit: Sprite.from("Yellow Plastic Bag"), coords: "10,11" },
      { snakeUnit: Sprite.from("Prybar"), coords: "10,12" },
    ] as SnakeData[];
    this.discoSnake.forEach((_, i) => {
      this.discoSnake[i].snakeUnit.x =
        CELL_SIZE * getCoordsFromSnake(this.discoSnake[i].coords)[0]; // first position
      this.discoSnake[i].snakeUnit.y =
        CELL_SIZE * getCoordsFromSnake(this.discoSnake[i].coords)[1];
      this.discoSnake[i].snakeUnit.height = CELL_SIZE;
      this.discoSnake[i].snakeUnit.width = CELL_SIZE;
      this.discoSnake[i].snakeUnit.anchor.set(0.5);
      this.discoSnake[i].snakeUnit.zIndex = 100;

      this.addChild(this.discoSnake[i].snakeUnit);
    });

    Manager.stage.addChild(this.grid);
    Manager.changeSpeed(DEFAULT_SPEED);

    document.addEventListener("keydown", this.changeDirection);

    this.createNewBooty();

    this.discoSnake[0].snakeUnit.addListener("grow", () => {
      this.addChild(this.discoBooty);
    });
  }

  private checkCollision = () => {
    const isCollidedWithBooty =
      this.discoSnake[0].snakeUnit.x === this.bootyData.xCellpx &&
      this.discoSnake[0].snakeUnit.y === this.bootyData.yCellpx;

    if (isCollidedWithBooty) {

      this.points += this.bootyData.points;
      this.pointsCounter.text = `${this.points}`;

      // every 2 snake units speed becomes faster, level increase
      if (this.discoSnake.length % 2 === 0) {
        this.level++;
        this.levelsCounter.text = `${this.level}`;
        Manager.changeSpeed(Manager.speed - 2);
      }

      // add new poart to the snake's tail, not animated
      this.animatedBooty.end(); // TODO: BUG stops in the middle of animation

      this.discoSnake.push({
        snakeUnit: this.discoBooty,
        coords: this.bootyData.coords,
      });

      // place new part at the end of the existing tail
      this.discoSnake[0].snakeUnit.emit("grow");
      this.move(this.direction);

      this.createNewBooty();
      return;
    }

    const allUnitsCoords = this.discoSnake.map((s) => s.coords);
    const headCoords = allUnitsCoords.filter(
      (c) => c === this.discoSnake[0].coords
    );
    const isCollidedWithTail = headCoords.length > 1;

    if (isCollidedWithTail) {
      this.gameOver();
    }
  };

  private changeDirection = (e: KeyboardEvent): void => {
    switch (true) {
      case keyCodeMap.top.includes(e.code): {
        this.move("top");
        break;
      }

      case keyCodeMap.right.includes(e.code): {
        this.move("right");
        break;
      }

      case keyCodeMap.bottom.includes(e.code): {
        this.move("bottom");
        break;
      }

      case keyCodeMap.left.includes(e.code): {
        this.move("left");
        break;
      }
    }

    this.checkCollision();
  };

  // Lets disco!
  public update = (): void => {
    switch (this.direction) {
      case "top":
        this.move("top");
        break;
      case "right":
        this.move("right");
        break;
      case "left":
        this.move("left");
        break;
      case "bottom":
        this.move("bottom");
        break;
      default:
        break;
    }

    this.checkCollision();
  };

  // TODO: bugs?
  public resize = (w: number, h: number): void => {
    this.grid.destroy();
    this.grid = drawGrid(w, h);
    Manager.stage.addChild(this.grid);
  };

  private goToRecords = (): void => {
    this.discoBooty.destroy();
    Manager.changeScene(new RecordsScene());
  };

  private gameOver = (): void => {
    this.discoBooty.destroy();

    const recordsLS = localStorage.getItem("DiscoSnakeRecords") || "";
    const newRecords = recordsLS + `;Tanya:${this.points}`;

    localStorage.removeItem("DiscoSnakeRecords");

    localStorage.setItem("DiscoSnakeRecords", JSON.stringify(newRecords));

    Manager.changeScene(new GameOverScene());
  };
}
