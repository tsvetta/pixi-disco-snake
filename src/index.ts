import { Application } from "pixi.js";

import { examples } from "./examples/index";

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x6495ed,
  width: 640,
  height: 480,
});

// app.stage.height = app.screen.height;
// app.stage.width = app.screen.width;

examples(app);
