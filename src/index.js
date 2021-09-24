import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";

const gwidth = 800;
const gheight = 600;
let initPosition = {x: gwidth/10, y:gheight/2}

const SHARED_CONFIG ={
  width: gwidth,
  height: gheight,
  startPosition: initPosition
}

const Scenes = [PreloadScene,MenuScene,PlayScene];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = ()=> Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics:{
    default: "arcade",
    arcade:{
      gravity: 0,
    },
  },
  scene: initScenes(),
  debug: true,
}


const game = new Phaser.Game(config);