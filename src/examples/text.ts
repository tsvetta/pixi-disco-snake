import { Container, Text, TextStyle } from "pixi.js";

export const textFn = (container: Container) => {
  const styly: TextStyle = new TextStyle({
    align: 'center',
    fill: '#d3fc03',
    fontSize: 22,
  });

  const texty: Text = new Text('私に気づいて先輩！', styly);

  // texty.text = 'This is expensive to change, please do not abuse';

  container.addChild(texty)
}
