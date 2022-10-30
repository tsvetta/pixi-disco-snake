import { BitmapFont, BitmapText, Container } from "pixi.js";

export const bitmapFn = (container: Container) => {
  BitmapFont.from('comic 32', {
    fill: '#ffffff',
    fontFamily: 'Comic Sans MS',
    fontSize: 30,
  }, /* { chars: BitmapFont.ASCII} */);

  const bitmap: BitmapText = new BitmapText('I love baking, my family, and my friends', {
    fontName: 'comic 32',
    fontSize: 30,
    tint: 0xFF0000,
  });

  container.addChild(bitmap)

  // bitmap.text = "This is cheap";
}
