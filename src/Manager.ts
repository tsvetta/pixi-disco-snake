import { Group as TweedleGroup } from "tweedle.js";
// import { GodrayFilter } from '@pixi/filter-godray';

import { Application, Container, DisplayObject, filters } from "pixi.js";

export class Manager {
  private static app: Application;
  private static currentScene: IScene;

  public static get width(): number {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  public static get height(): number {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  }

  public static stage: Container;

  public static initialize(background: number): void {
    Manager.app = new Application({
      view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      // backgroundColor: background,
      // backgroundAlpha: 0,
      width: this.width,
      height: this.height,
    });

    Manager.stage = Manager.app.stage;

    // @ts-ignore
    // Manager.stage.filters = [new GodrayFilter({
    //   angle: 30,
    //   gain: 0.695,
    //   lacunarity: 2.01,
    //   parallel: false,
    //   time: 0.109,
    //   center: [0, 0],
    //   alpha: 1,
    // })];

    Manager.app.ticker.add(Manager.update);

    window.addEventListener("resize", Manager.resize);
  }

  private static resize(): void {
    if (Manager.currentScene) {
      Manager.currentScene.resize(Manager.width, Manager.height);
    }
  }

  public static changeScene(newScene: IScene): void {
    if (Manager.currentScene) {
      Manager.app.stage.removeChild(Manager.currentScene);

      Manager.currentScene.destroy(); // not destroying game -> records ???
    }

    Manager.currentScene = newScene;
    Manager.app.stage.addChild(Manager.currentScene);
  }

  private static maxDelta = 50;
  public static changeSpeed(maxDelta: number): void {
    Manager.maxDelta = maxDelta;
  }

  private static currentDelta = 0;
  public static changeSpeedDelta(delta: number): void {
    Manager.currentDelta = delta;
  }

  private static update(delta: number): void {
    TweedleGroup.shared.update(100); // to animate booty

    Manager.currentDelta += delta;

    if (Manager.currentDelta >= Manager.maxDelta) {
      Manager.currentDelta = 5; // нужен запас, чтобы не перескакивало при нажатии клавиатуры???
      if (Manager.currentScene) {
        Manager.currentScene.update(delta); // to move ball
      }
    }
  }
}

export interface IScene extends DisplayObject {
  update(framesPassed: number): void;
  resize(screenWidth: number, screenHeight: number): void;
  maxDelta?: number;
}
