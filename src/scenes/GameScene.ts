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
  xCells: 0, // cell in x row
  yCells: 0,
  xpxStart: 0,
  xpxEnd: 0,
  ypxStart: 0,
  ypxEnd: 0,
  leftEdge: 0,
  rightEdge: 0,
  topEdge: 0,
  bottomEdge: 0,
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
  boundaries.bottomEdge = Manager.height - CELL_SIZE;

  grid.endFill();

  return grid;
};

const getCoordsFromSnake = (cell: string): number[] => {
  return cell.split(",").map(Number);
};

const generateBooty = () => {
  const ballNumber = Math.ceil(Math.random() * 10);
  let rndXCell = CELL_SIZE;
  let rndYCell = CELL_SIZE;

  const coords = ["10,10"]; // TODO randomize

  do {
    rndXCell = Math.floor(Math.random() * boundaries.xCells);
    rndYCell = Math.floor(Math.random() * boundaries.yCells);
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
  public direction: Direction = "right";
  private bootyData = generateBooty();
  private disco: Sprite[] = [this.bootyData.booty];
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

  private move(direction: Direction) {
    switch (direction) {
      case "top": {
        for (let i = 0; i < this.disco.length; i++) {
          this.disco[i].y -= this.discoJumpLength;

          if (this.disco[i].y < boundaries.topEdge) {
            this.disco[i].y = boundaries.ypxEnd;
          }
        }
        break;
      }

      case "right": {
        this.disco[0].x += this.discoJumpLength;

        if (this.disco[0].x > boundaries.rightEdge) {
          this.disco[0].x = boundaries.xpxStart;
        }

        break;
      }

      case "left": {
        this.disco[0].x -= this.discoJumpLength;

        if (this.disco[0].x < boundaries.leftEdge) {
          this.disco[0].x = boundaries.xpxEnd;
        }
        break;
      }

      case "bottom": {
        this.disco[0].y += this.discoJumpLength;

        if (this.disco[0].y > boundaries.bottomEdge) {
          this.disco[0].y = boundaries.ypxStart;
        }

        break;
      }
    }
  }

  private refreshBooty() {
    // this.discoBooty.destroy();
    this.bootyData = generateBooty();
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
  }

  private drawRecordsButton() {
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
  }

  private drawPointsCounter() {
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
  }

  constructor() {
    super();

    this.drawRecordsButton();
    this.drawPointsCounter();

    this.disco = [Sprite.from("Harry")];
    this.disco[0].x =
      CELL_SIZE * getCoordsFromSnake(this.bootyData.coords[0])[0]; // first position
    this.disco[0].y =
      CELL_SIZE * getCoordsFromSnake(this.bootyData.coords[0])[1];
    this.disco[0].height = CELL_SIZE;
    this.disco[0].width = CELL_SIZE;
    this.disco[0].anchor.set(0.5);

    this.addChild(this.disco[0]);

    Manager.stage.addChild(this.grid);
    Manager.changeSpeed(DEFAULT_SPEED);

    document.addEventListener("keydown", this.changeDirection);

    this.refreshBooty();

    this.disco[0].addListener("grow", () => {
      this.addChild(this.discoBooty);
    });
  }

  private computeBootyPositionInSnake = () => {
    const prevSnakePart = this.disco[this.disco.length - 2];

    switch (this.direction) {
      case "top":
        this.discoBooty.y = prevSnakePart.y + CELL_SIZE;
        break;
      case "left":
        this.discoBooty.x = prevSnakePart.x + CELL_SIZE;
        break;
      case "right":
        this.discoBooty.x = prevSnakePart.x - CELL_SIZE;
        break;
      case "bottom":
        this.discoBooty.y = prevSnakePart.y - CELL_SIZE;
        break;
    }
  };

  private checkCollision = () => {
    const isCollided =
      this.disco.filter(
        (d) => d.x === this.bootyData.xCellpx && d.y === this.bootyData.yCellpx
      ).length !== 0;

    if (isCollided) {
      if (this.bootyData.sunriseParabellum) {
        this.points += 5;
      } else {
        this.points++;
      }

      this.pointsCounter.text = `${this.points}`;

      this.disco.push(this.bootyData.booty);

      this.animatedBooty.end();

      this.computeBootyPositionInSnake();

      this.disco[0].emit("grow");

      this.refreshBooty();
    }
  };

  private changeDirection = (e: KeyboardEvent): void => {
    switch (true) {
      case keyCodeMap.top.includes(e.code): {
        this.direction = "top"; // нужно ли?
        Manager.changeSpeedDelta(0);
        this.move("top");
        break;
      }

      case keyCodeMap.right.includes(e.code): {
        this.direction = "right";
        Manager.changeSpeedDelta(0);
        this.move("right");
        break;
      }

      case keyCodeMap.bottom.includes(e.code): {
        this.direction = "bottom";
        Manager.changeSpeedDelta(0);
        this.move("bottom");
        break;
      }

      case keyCodeMap.left.includes(e.code): {
        this.direction = "left";
        Manager.changeSpeedDelta(0);
        this.move("left");
        break;
      }
    }

    this.checkCollision();
  };

  // Lets disco!
  public update(): void {
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
  }

  public resize(w: number, h: number): void {
    this.grid.destroy();
    this.grid = drawGrid(w, h);
    Manager.stage.addChild(this.grid);
  }

  private goToRecords = (): void => {
    this.discoBooty.destroy();
    Manager.changeScene(new RecordsScene());
  };
}
