import { Application, Sprite } from "pixi.js";

const keyCodeMap = {
  top: ["ArrowUp", "KeyW"],
  right: ["ArrowRight", "KeyD"],
  bottom: ["ArrowDown", "KeyS"],
  left: ["ArrowLeft", "KeyA"],
};


const checkBounds = (star: Sprite, app: Application) => {
  switch (true) {
    case star.getGlobalPosition().x < 0: {
      star.x = 0;
      break;
    }
    case star.getGlobalPosition().y < 0: {
      star.y = 0;
      break;
    }
    case star.getGlobalPosition().x > app.screen.width: {
      star.x = app.view.clientWidth;
      break;
    }
    case star.getGlobalPosition().y > app.screen.height: {
      star.y = app.view.clientHeight;
      break;
    }
  }
};

export const keyboardEventsFn = (app: Application) => {
  let star: Sprite = Sprite.from("star.png");

  star.anchor.set(0.5);
  star.width = 300;
  star.height = 300;
  star.x = app.screen.width / 2;
  star.y = app.screen.height / 2;

  app.stage.addChild(star);

  const onKeyDownFn = (e: KeyboardEvent) => {
    switch (true) {
      // @ts-ignore
      case keyCodeMap.top.includes(e.code): {
        star.y = star.y - 10;
        break;
      }

      // @ts-ignore
      case keyCodeMap.right.includes(e.code): {
        star.x = star.x + 10;
        break;
      }

      // @ts-ignore
      case keyCodeMap.bottom.includes(e.code): {
        star.y = star.y + 10;
        break;
      }

      // @ts-ignore
      case keyCodeMap.left.includes(e.code): {
        star.x = star.x - 10;
        break;
      }
    }

    checkBounds(star, app);
  };

  document.addEventListener("keydown", onKeyDownFn);
};
