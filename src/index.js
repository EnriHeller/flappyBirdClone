import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";

const gwidth = 800;
const gheight = 600;
let initPosition = {x: gwidth/10, y:gheight/2}

const SHARED_CONFIG ={
  width: gwidth,
  height: gheight,
  startPosition: initPosition
}

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics:{
    default: "arcade",
    arcade:{
      gravity: 0,
    },
  },
  scene: [new MenuScene(SHARED_CONFIG), new PlayScene(SHARED_CONFIG)], 
  debug: true,
}


const game = new Phaser.Game(config);