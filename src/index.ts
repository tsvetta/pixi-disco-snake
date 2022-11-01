import { Manager } from './Manager';
import { LoaderScene } from './scenes/LoaderScene';

Manager.initialize(0x000000);

const loaderScene: LoaderScene = new LoaderScene();

Manager.changeScene(loaderScene);
