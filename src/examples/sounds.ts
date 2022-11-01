import { Application, Sprite } from "pixi.js";
import { utils } from '@pixi/sound';

const D_sharp = utils.sineTone(622.25, 1); // https://pages.mtu.edu/~suits/notefreqs.html

export const soundsFn = (app: Application) => {
  let star: Sprite = Sprite.from("star.png");

  star.anchor.set(0.5);
  star.width = 300;
  star.height = 300;
  star.x = app.screen.width / 2;
  star.y = app.screen.height / 2;

  app.stage.addChild(star);

  star.on('click', () => {
    D_sharp.play();
  })

  star.interactive = true;
};
