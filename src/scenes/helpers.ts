import { Graphics, Sprite } from "pixi.js";
import { Manager } from "../Manager";
import { KeyCodes, SnakeData } from "./snake-types";

export const boundaries = {
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

export const CELL_SIZE = 30;

export const keyCodeMap: KeyCodes = {
  top: ["ArrowUp", "KeyW"],
  right: ["ArrowRight", "KeyD"],
  bottom: ["ArrowDown", "KeyS"],
  left: ["ArrowLeft", "KeyA"],
};

export const DEFAULT_SPEED = 50;

export const drawGrid = (w: number, h: number) => {
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

export const getCoordsFromSnake = (cell?: string): number[] => {
  return cell ? cell.split(",").map(Number) : [10, 10];
};

export const generateBootyData = (snake?: SnakeData[]) => {
  const bootySprites = [
    { sprite: Sprite.from("Disco Ball 1"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 2"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 3"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 4"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 5"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 6"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 7"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 8"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 9"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 10"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 11"), chance: 6, points: 1 },
    { sprite: Sprite.from("Disco Ball 12"), chance: 6, points: 1 },
    /* ---- */
    { sprite: Sprite.from("Astra"), chance: 3, points: 2 },
    { sprite: Sprite.from("Commodore Red"), chance: 3, points: 2 },
    { sprite: Sprite.from("Goracy Brew"), chance: 3, points: 3 },
    { sprite: Sprite.from("Pale Aged Vodka"), chance: 3, points: 4 },
    { sprite: Sprite.from("Potent Pilsner"), chance: 3, points: 2 },
    { sprite: Sprite.from("Preptide"), chance: 3, points: 3 },
    { sprite: Sprite.from("Pyrholidon"), chance: 3, points: 2 },
    { sprite: Sprite.from("Speedbottle"), chance: 3, points: 3 },
    { sprite: Sprite.from("Tioumoutiri"), chance: 3, points: 3 },
  ];
  const bootyKim = { sprite: Sprite.from("Kim"), chance: 1, points: 5 };

  // TODO Randomize first coords
  const coords = !snake ? "10,10" : snake.map((s) => s.coords).join(";");

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

  const bootyNumber = Math.floor(Math.random() * bootySprites.length);
  console.log("bootyNumber", bootyNumber);
  const booty: Sprite = bootySprites[bootyNumber].sprite;
  booty.x = xCellpx;
  booty.y = yCellpx;

  booty.name = sunriseParabellum ? "Kim" : `Disco Ball ${bootyNumber}`;

  return {
    booty: sunriseParabellum ? bootyKim.sprite : booty,
    points: sunriseParabellum ? bootyKim.points : bootySprites[bootyNumber].points,
    coords,
    xCellpx, // make same as coords?
    yCellpx,
    sunriseParabellum,
  };
};
