import {
  AnimatedSprite,
  Application,
  // Sprite,
  Texture,
  Ticker,
} from "pixi.js";

export const tickerFn = (app: Application) => {
  const stars: Texture[] = [
    Texture.from("star.png"),
    Texture.from("star-2.png"),
  ];

  // Instead it could be simple sprite:
  // let star: Sprite = Sprite.from('star.png');
  let star: AnimatedSprite = new AnimatedSprite(stars);
  let starVelocity: number = 5;

  star.width = 300;
  star.height = 300;
  star.x = 0;
  star.y = app.screen.height / 2;
  star.anchor.set(0.5);
  star.animationSpeed = 0.1;

  app.stage.addChild(star);

  const updateFn = (deltaTime: number): void => {
    star.x = star.x + starVelocity * deltaTime;

    if (star.x > app.screen.width) {
      star.x = 0;
    }
  }

  star.play()
  Ticker.shared.add(updateFn);
};
