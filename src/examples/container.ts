import { Container } from "pixi.js";

export const containerFn = (parentContainer: Container) => {
  const conty: Container = new Container();

  conty.x = 200;
  conty.y = 0;
  conty.angle = 45;
  conty.setTransform()

  parentContainer.addChild(conty);
};
