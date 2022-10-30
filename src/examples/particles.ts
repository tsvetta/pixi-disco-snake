import { Container, ParticleContainer, Texture } from "pixi.js";
import { Emitter as ParticleEmitter } from 'pixi-particles';
import particleSettings from '../emitter.json';

export const particelsFn = (container: Container) => {
  const particleContainer = new ParticleContainer();

  container.addChild(particleContainer);

  const emitter = new ParticleEmitter(
    particleContainer,
    [Texture.from("particle.png")],
    particleSettings
  );

  emitter.autoUpdate = true;
  emitter.updateSpawnPos(400, 300);
  emitter.emit = true;
};
