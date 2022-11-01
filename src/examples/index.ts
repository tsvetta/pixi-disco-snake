import { Application, /* Sprite */ } from "pixi.js";

import { containerFn } from "./container";
// import { spriteFn } from "./sprite";
// import { graphicsFn } from "./graphics";
// import { textFn } from "./text";
// import { bitmapFn } from "./bitmap-text";
// import { filterFn } from "./filter";
// import { particelsFn } from "./particles";
// import { contextFn } from "./context";
// import { sceneFn } from "./scene";
// import { /* AnimatedScene, */ animatedSpriteFn } from "./animated-sprite";
// import { tickerFn } from "./ticker";
// import { tweensFn } from "./tweens";
// import { pointerEventsFn } from "./pointer-events";
// import { keyboardEventsFn } from "./keyboard-events";
// import { customEventsFn } from "./custom-events";
import { soundsFn } from "./sounds";

export const examples = (app: Application) => {
  containerFn(app.stage);

  // const clampy: Sprite = Sprite.from("clampy.png");

  // spriteFn(clampy, app.stage);
  // graphicsFn(app.stage);
  // textFn(app.stage);
  // bitmapFn(app.stage);
  // filterFn(clampy);
  // particelsFn(app.stage);
  // contextFn();
  // sceneFn(app);
  // animatedSpriteFn(app.stage);
  // const animatedStars = new AnimatedScene(app.stage);
  // tickerFn(app);
  // tweensFn(app);
  // pointerEventsFn(app);
  // keyboardEventsFn(app);
  // customEventsFn(app);
  soundsFn(app);
};
