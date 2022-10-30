import { Application, Sprite } from "pixi.js";

import { bitmapFn } from "./bitmap-text";
import { containerFn } from "./container";
import { contextFn } from "./context";
import { filterFn } from "./filter";
import { graphicsFn } from "./graphics";
import { particelsFn } from "./particles";
import { spriteFn } from "./sprite";
import { textFn } from "./text";
import { sceneFn } from "./scene";

export const examples = (app: Application) => {
  containerFn(app.stage);

  const clampy: Sprite = Sprite.from("clampy.png");

  spriteFn(clampy, app.stage);
  graphicsFn(app.stage);
  textFn(app.stage);
  bitmapFn(app.stage);
  filterFn(clampy);
  particelsFn(app.stage);
  contextFn();
  sceneFn(app);
};
