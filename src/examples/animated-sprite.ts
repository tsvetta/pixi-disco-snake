import {
  AnimatedSprite,
  Container,
  Texture,
} from "pixi.js";

export const animatedSpriteFn = (container: Container) => {
  const stars: Texture[] = [
    Texture.from("star.png"),
    Texture.from("star-2.png"),
  ];

  let sprite: AnimatedSprite = new AnimatedSprite(stars);

  container.addChild(sprite);

  sprite.animationSpeed = 0.1;
  sprite.x = 200;
  sprite.y = 100;
  sprite.width = 300;
  sprite.height = 300;

  sprite.onFrameChange = (currentFrame) => {
    console.log("Star's current frame is", currentFrame);
  }

  sprite.play();
};
