import { Container, Graphics } from "pixi.js";

export const graphicsFn = (container: Container) => {
  const graphy = new Graphics();

  graphy.beginFill(0xfffff00);
  graphy.lineStyle(3, 0x00ffff);
  graphy.drawCircle(0, 0, 100);
  graphy.endFill();

  container.addChild(graphy);

  graphy.x = 400;
  graphy.y = 300;
};
