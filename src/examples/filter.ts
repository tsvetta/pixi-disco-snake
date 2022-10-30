import { Container, filters } from "pixi.js";

export const filterFn = (container: Container) => {
  const myBlurFilter = new filters.BlurFilter();

  container.filters = [myBlurFilter];
}

