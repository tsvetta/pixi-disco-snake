import { Container, Sprite } from "pixi.js";

export const spriteFn = (sprite: Sprite, container: Container) => {
  sprite.anchor.set(0.5);
  // sprite.x = app.screen.width / 2;
  // sprite.y = app.screen.height / 2;
  sprite.x = 100;
  sprite.y = 200;
  sprite.scale.set(0.5);
  // sprite.anchor.set(0);
  sprite.tint = 0xFF00FF;


  container.addChild(sprite);
}
