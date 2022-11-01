import {
  Application,
  InteractionEvent,
  Sprite,
} from "pixi.js";

const onClick = (e: InteractionEvent) => {
  console.log(e.data.getLocalPosition(e.target))
}

export const pointerEventsFn = (app: Application) => {
  let star: Sprite = Sprite.from('star.png');

  star.anchor.set(0.5);
  star.width = 300;
  star.height = 300;
  star.x = app.screen.width / 2;
  star.y = app.screen.height / 2;

  app.stage.addChild(star);

  star.on('pointertap', onClick, star);
  star.interactive = true;
};
