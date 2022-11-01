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


// example from documentation (almost)

// export class AnimatedScene extends Container {
//   constructor(parentContainer: Container) {
//       super();

//       const starFrames: Texture[] = [
//         Texture.from("star.png"),
//         Texture.from("star-2.png"),
//       ];

//       const animatedStarSprite: AnimatedSprite = new AnimatedSprite(starFrames);

//       parentContainer.addChild(animatedStarSprite);

//       animatedStarSprite.onFrameChange = this.onClampyFrameChange.bind(this);

//       animatedStarSprite.animationSpeed = 0.1;
//       animatedStarSprite.x = 200;
//       animatedStarSprite.y = 100;
//       animatedStarSprite.width = 300;
//       animatedStarSprite.height = 300;

//       animatedStarSprite.play();
//   }

//   private onClampyFrameChange(currentFrame: number): void {
//       console.log("Start's current frame is", currentFrame);
//   }
// }
