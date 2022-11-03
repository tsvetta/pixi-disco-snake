import { BitmapText, Container, Graphics, Sprite } from "pixi.js";
import { Tween } from "tweedle.js";

import { IScene, Manager } from "../Manager";
import { RecordsScene } from "./RecordsScene";
import { Direction, SnakeData } from "./snake-types";

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

const boundaries = {
  xCells: 0, // cells in x row
  yCells: 0,
  xpxStart: 0,
  xpxEnd: 0,
  ypxStart: 0,
  ypxEnd: 0,
  leftEdge: 0,
  rightEdge: 0,
  topEdge: 0,
  bottomEdge: 0,
  topY: 0,
  bottomY: 0,
  leftX: 0,
  rightX: 0,
};

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

  for (let i = 0; i < horizontalLines; i++) {
    const nextLinePosition = 0 + i * CELL_SIZE;
    const horizontalLineWidth =
      actualLineWidth - CELL_SIZE * (sidesPadding * 2);

    grid.drawRect(0, nextLinePosition, horizontalLineWidth, 1);
  }

  for (let i = 0; i < verticalLines; i++) {
    const nextLinePosition = 0 + i * CELL_SIZE;
    const verticalLineHeight =
      actualLineHeight - CELL_SIZE * topPadding - sidesPadding - CELL_SIZE;

    grid.drawRect(nextLinePosition, 0, 1, verticalLineHeight);
  }

  boundaries.xCells = verticalLines;
  boundaries.yCells = horizontalLines - 1;
  boundaries.xpxStart = grid.x;
  boundaries.xpxEnd = boundaries.xCells * CELL_SIZE;
  boundaries.ypxStart = grid.y;
  boundaries.ypxEnd = boundaries.yCells * CELL_SIZE + grid.y;

  boundaries.leftEdge = grid.x;
  boundaries.rightEdge = Manager.width - CELL_SIZE * 2;
  boundaries.topEdge = grid.y;
  boundaries.bottomEdge = Manager.height - CELL_SIZE * 2;

  boundaries.topY = CELL_SIZE * 4;
  boundaries.rightX = Math.floor(boundaries.rightEdge / CELL_SIZE);
  boundaries.leftX = CELL_SIZE * 2;
  boundaries.bottomY = Math.floor(boundaries.bottomEdge / CELL_SIZE);

  grid.endFill();

  return grid;
};

const getCoordsFromSnake = (cell?: string): number[] => {
  return cell ? cell.split(",").map(Number) : [10, 10];
};

const generateBootyData = (snake?: SnakeData[]) => {
  // TODO Randomize first coords
  const coords = !snake ? "10,10" : snake.map((s) => s.coords).join(";");
  const ballNumber = Math.ceil(Math.random() * 10);
  let rndXCell = CELL_SIZE;
  let rndYCell = CELL_SIZE;

  do {
    rndXCell = Math.round(Math.random() * boundaries.xCells);
    rndYCell = Math.round(Math.random() * boundaries.yCells);
  } while (coords.includes(`${rndXCell},${rndYCell}`)); // no intersections with snake

  const xCellpx = Math.min(
    Math.max(rndXCell * CELL_SIZE, boundaries.leftEdge),
    boundaries.rightEdge
  );
  const yCellpx = Math.min(
    Math.max(rndYCell * CELL_SIZE, boundaries.topEdge),
    boundaries.bottomEdge
  );

  // just because
  const MAGIC_KIM_NUMBER = 9;
  const sunriseParabellum =
    Math.floor(Math.random() * 100) % MAGIC_KIM_NUMBER === 0;

  const booty: Sprite = Sprite.from(`disco ball ${ballNumber}`);
  booty.x = xCellpx;
  booty.y = yCellpx;

  return {
    booty,
    coords,
    ballNumber,
    xCellpx, // make same as coords?
    yCellpx,
    sunriseParabellum,
  };
};

export class GameScene extends Container implements IScene {
  public direction: Direction = "top";
  private discoSnake: SnakeData[];
  private bootyData = generateBootyData();
  // @ts-ignore
  private animatedBooty: Tween<ObservablePoint<any>>;

  private discoBooty: Sprite = Sprite.from(
    `disco ball ${this.bootyData.ballNumber}`
  );
  private grid: Graphics = drawGrid(Manager.width, Manager.height);
  private discoJumpLength: number = CELL_SIZE;
  private points: number = 0;
  private pointsCounter = new BitmapText(`${this.points}`, {
    fontName: "monotype",
    fontSize: 30,
    tint: 0xffffff,
  });

  private move = (direction: Direction) => {
    Manager.changeSpeedDelta(0); // to prevent jumping after pressing the key
    // Manager.changeSpeed(60); // TODO: make it faster

    switch (direction) {
      case "top": {
        if (this.direction === 'bottom') break; // can't go backwards
        this.direction = "top";

        for (let i = this.discoSnake.length - 1; i >= 0; i--) {
          const oldCoords = getCoordsFromSnake(this.discoSnake[i].coords);

          // if unit on edge
          if (this.discoSnake[i].snakeUnit.y <= boundaries.topEdge) {
            this.discoSnake[i].snakeUnit.y = boundaries.ypxEnd;

            const newY = boundaries.bottomY;
            this.discoSnake[i].coords = `${oldCoords[0]},${newY}`;
            continue;
          }

          // if first unit
          if (i === 0) {
            this.discoSnake[i].snakeUnit.y = this.discoSnake[i].snakeUnit.y - CELL_SIZE;
            this.discoSnake[i].coords = `${oldCoords[0]},${oldCoords[1] - 1}`;
          } else {
            this.discoSnake[i].snakeUnit.y = this.discoSnake[i - 1].snakeUnit.y;
            this.discoSnake[i].coords = this.discoSnake[i - 1].coords;
          }
        }

        break;
      }

      case "right": {
        if (this.direction === 'left') break; // can't go backwards
        this.direction = "right";

        for (let i = this.discoSnake.length - 1; i >= 0; i--) {
          const oldCoords = getCoordsFromSnake(this.discoSnake[i].coords);

          // if unit on edge
          if (this.discoSnake[i].snakeUnit.x > boundaries.rightEdge) {
            this.discoSnake[i].snakeUnit.x = CELL_SIZE;

            const newX = boundaries.leftX;
            this.discoSnake[i].coords = `${newX},${oldCoords[1]}`;
            continue;
          }

          // if first unit
          if (i === 0) {
            this.discoSnake[i].snakeUnit.x = this.discoSnake[i].snakeUnit.x + CELL_SIZE;
            this.discoSnake[i].coords = `${oldCoords[0] + 1},${oldCoords[1]}`;
          } else {
            this.discoSnake[i].snakeUnit.x = this.discoSnake[i - 1].snakeUnit.x;
            this.discoSnake[i].coords = this.discoSnake[i - 1].coords;
          }
        }

        break;
      }

      case "left": {
        if (this.direction === 'right') break; // can't go backwards
        this.direction = "left";

        for (let i = this.discoSnake.length - 1; i >= 0; i--) {
          const oldCoords = getCoordsFromSnake(this.discoSnake[i].coords);

          // if unit on edge
          if (this.discoSnake[i].snakeUnit.x <= boundaries.leftEdge) {
            this.discoSnake[i].snakeUnit.x = boundaries.xpxEnd;

            const newX = boundaries.rightX;
            this.discoSnake[i].coords = `${newX},${oldCoords[1]}`;
            continue;
          }

          // if first unit
          if (i === 0) {
            this.discoSnake[i].snakeUnit.x = this.discoSnake[i].snakeUnit.x - CELL_SIZE;
            this.discoSnake[i].coords = `${oldCoords[0] - 1},${oldCoords[1]}`;
          } else {
            this.discoSnake[i].snakeUnit.x = this.discoSnake[i - 1].snakeUnit.x;
            this.discoSnake[i].coords = this.discoSnake[i - 1].coords;
          }
        }

        break;
      }

      case "bottom": {
        if (this.direction === 'top') break; // can't go backwards
        this.direction = "bottom";

        for (let i = this.discoSnake.length - 1; i >= 0; i--) {
          const oldCoords = getCoordsFromSnake(this.discoSnake[i].coords);

          // if unit on edge
          if (this.discoSnake[i].snakeUnit.y > boundaries.bottomEdge) {
            this.discoSnake[i].snakeUnit.y = CELL_SIZE * 4;

            const newY = boundaries.topY;
            this.discoSnake[i].coords = `${oldCoords[0]},${newY}`;
            continue;
          }

          // if first unit
          if (i === 0) {
            this.discoSnake[i].snakeUnit.y = this.discoSnake[i].snakeUnit.y + CELL_SIZE;
            this.discoSnake[i].coords = `${oldCoords[0]},${oldCoords[1] + 1}`;
          } else {
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
    this.discoBooty = this.bootyData.sunriseParabellum
      ? Sprite.from("Kim")
      : Sprite.from(`disco ball ${this.bootyData.ballNumber}`);
    Manager.stage.addChild(this.discoBooty);

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

  constructor() {
    super();

    this.drawRecordsButton();
    this.drawPointsCounter();

    this.discoSnake = [{ snakeUnit: Sprite.from("Harry"), coords: "10,10" }];
    this.discoSnake[0].snakeUnit.x =
      CELL_SIZE * getCoordsFromSnake(this.bootyData.coords)[0]; // first position
    this.discoSnake[0].snakeUnit.y =
      CELL_SIZE * getCoordsFromSnake(this.bootyData.coords)[1];
    this.discoSnake[0].snakeUnit.height = CELL_SIZE;
    this.discoSnake[0].snakeUnit.width = CELL_SIZE;
    this.discoSnake[0].snakeUnit.anchor.set(0.5);

    this.addChild(this.discoSnake[0].snakeUnit);

    Manager.stage.addChild(this.grid);
    Manager.changeSpeed(DEFAULT_SPEED);

    document.addEventListener("keydown", this.changeDirection);

    this.createNewBooty();

    this.discoSnake[0].snakeUnit.addListener("grow", () => {
      this.computeBootyPositionInSnake();
      // this.move(this.direction)
      this.addChild(this.discoBooty);
    });
  }

  private computeBootyPositionInSnake = () => {
    const prevSnakePart = this.discoSnake[this.discoSnake.length - 2];

    console.log("old booty position", this.discoBooty.x, this.discoBooty.y);

    switch (this.direction) {
      case "top": {
        if (this.discoBooty.y === boundaries.bottomEdge) {
          this.discoBooty.y = boundaries.bottomEdge + CELL_SIZE;
        } else {
          this.discoBooty.y = prevSnakePart.snakeUnit.y + CELL_SIZE;
        }

        break;
      }
      case "left": {
        if (this.discoBooty.x === boundaries.rightEdge) {
          this.discoBooty.x = boundaries.rightEdge + CELL_SIZE;
        } else {
          this.discoBooty.x = prevSnakePart.snakeUnit.x + CELL_SIZE;
        }

        break;
      }
      case "right": {
        if (this.discoBooty.x === boundaries.leftEdge) {
          this.discoBooty.x = boundaries.leftEdge - CELL_SIZE;
        } else {
          this.discoBooty.x = prevSnakePart.snakeUnit.x - CELL_SIZE;
        }
        break;
      }
      case "bottom": {
        if (this.discoBooty.y === boundaries.topEdge) {
          this.discoBooty.y = boundaries.bottomEdge - CELL_SIZE;
        } else {
          this.discoBooty.y = prevSnakePart.snakeUnit.y - CELL_SIZE;
        }

        break;
      }
    }
  };

  private checkCollision = () => {
    const isCollided =
      this.discoSnake.filter(
        (d) =>
          d.snakeUnit.x === this.bootyData.xCellpx &&
          d.snakeUnit.y === this.bootyData.yCellpx
      ).length !== 0;

    if (isCollided) {
      // luck!
      if (this.bootyData.sunriseParabellum) {
        this.points += 5;
      } else {
        this.points++;
      }

      this.pointsCounter.text = `${this.points}`;

      // add new poart to the snake's tail, not animated
      this.animatedBooty.end();
      this.discoSnake.push({
        snakeUnit: this.bootyData.booty,
        coords: this.bootyData.coords,
      });

      // place new part near the end of the existing tail
      this.discoSnake[0].snakeUnit.emit("grow");

      this.createNewBooty();
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

  // TODO
  // private gameOver = (): void => {
  //   this.discoBooty.destroy();
  //   Manager.changeScene(new GameOverScene());
  // };
}
