import { Application, Sprite } from "pixi.js";

export const customEventsFn = (app: Application) => {
  let star: Sprite = Sprite.from("star.png");

  star.anchor.set(0.5);
  star.width = 300;
  star.height = 300;
  star.x = app.screen.width / 2;
  star.y = app.screen.height / 2;

  app.stage.addChild(star);

  let counter = 0;

  const onShine = () => {
    console.log("It shines!", counter);
    counter++;
    star.scale.set(star.scale.x + 0.005);
  };

  const shiningInterval = setInterval(() => {
    star.emit("shine");
  }, 1000);

  star.on("shine", onShine);

  star.on('click', () => {
    clearInterval(shiningInterval);
    console.log("Not shining anymore...")
  })

  star.interactive = true;
};
