import { Tween, Group } from "tweedle.js";

import {
  Application,
  Sprite,
  Ticker,
} from "pixi.js";

export const tweensFn = (app: Application) => {
  let star: Sprite = Sprite.from('star.png');

  star.anchor.set(0.5);
  star.x = app.screen.width / 2;
  star.y = app.screen.height / 2;

  app.stage.addChild(star);

  const updateFn = () => {
    Group.shared.update()
  }

  Ticker.shared.add(updateFn);

  new Tween(star.scale)
    .to({ x: 0.1, y: 0.1 }, 1000)
    .repeat(Infinity)
    .yoyo(true)
    .start();

};
