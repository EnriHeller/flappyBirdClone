import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";

const gwidth = 800;
const gheight = 600;
let initPosition = {x: gwidth/10, y:gheight/2}

const SHARED_CONFIG ={
  width: gwidth,
  height: gheight,
  startPosition: initPosition
}

const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene ];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = ()=> Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics:{
    default: "arcade",
    arcade:{
      gravity: 0,
    },
  },
  scene: initScenes(),
}


const game = new Phaser.Game(config);