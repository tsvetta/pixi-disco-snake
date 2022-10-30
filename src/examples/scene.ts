import { Application, Container, Sprite } from "pixi.js";

export class Scene extends Container {
  private readonly screenWidth: number;
  private readonly screenHeight: number;

  // star is a member of the class
  private star: Sprite;

  constructor(screenWidth: number, screenHeight: number) {
      super(); // Mandatory! This calls the superclass constructor.

      // see how members of the class need `this.`?
      this.screenWidth = screenWidth;
      this.screenHeight = screenHeight;

      // Now star is a class member, we will be able to use it in another methods!
      this.star = Sprite.from("star.png");

      this.star.anchor.set(0.5);
      this.star.x = this.screenWidth / 2;
      this.star.y = this.screenHeight / 2;
      this.addChild(this.star);
  }
}

export const sceneFn = (app: Application) => {
  const sceny = new Scene(app.screen.width, app.screen.height)

  app.stage.addChild(sceny);
};
