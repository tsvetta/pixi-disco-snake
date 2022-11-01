import { Application, ParticleContainer, Texture } from "pixi.js";
import { Emitter as ParticleEmitter } from 'pixi-particles';
import particleSettings from '../emitter.json';

export const particelsFn = (app: Application) => {
  const particleContainer = new ParticleContainer();

  // @ts-ignore
  app.stage.addChild(particleContainer);

  const emitter = new ParticleEmitter(
    // @ts-ignore
    particleContainer,
    [Texture.from("particle.png")],
    particleSettings
  );

  emitter.autoUpdate = true;
  emitter.updateSpawnPos(600, 500);
  emitter.emit = true;
};
