import { Sprite } from "pixi.js";

export type Direction = "left" | "right" | "top" | "bottom";

export type SnakeData = {
  snakeUnit: Sprite;
  coords?: string;
};
