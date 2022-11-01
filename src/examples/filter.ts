import { Filter, filters, Sprite } from "pixi.js";

export const filterFn = (container: Sprite) => {
  const myBlurFilter: Filter = new filters.BlurFilter();

  // @ts-ignore
  container.filters = [myBlurFilter];
}

