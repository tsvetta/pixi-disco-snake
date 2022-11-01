import { Manager } from './Manager';
import { LoaderScene } from './scenes/LoaderScene';

Manager.initialize(0xffffff);

const loaderScene: LoaderScene = new LoaderScene();

Manager.changeScene(loaderScene);
