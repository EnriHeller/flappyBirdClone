import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const gwidth = 800;
const gheight = 600;
let initPosition = {x: gwidth/10, y:gheight/2}

const SHARED_CONFIG ={
  width: gwidth,
  height: gheight,
  startPosition: initPosition
}

let bird ;
let pipes;
let VELOCITY = 200;
let flyVelocity = -300;
let pipeHorizontalPosition = 0;
let pipeHorizontalDistance = 0;


const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics:{
    default: "arcade",
    arcade:{
      gravity: 0,
    },
  },
  scene: [new PlayScene(SHARED_CONFIG)], 
  debug: true,
}

const pipeVerticalDistanceRange = [150,250];
const pipeHorizontalDistanceRange = [400, 500];

const pipesToRender = 15;

//DATA
function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "/assets/bird.png");
  this.load.image("pipe", "/assets/pipe.png");
}

//DEFINITIONS
function create(){
  this.add.image(0, 0, "sky" ).setOrigin(0);

  bird = this.physics.add.sprite(initPosition.x,initPosition.y, "bird").setOrigin(0);
  bird.body.gravity.y = 800; 
  
  pipes = this.physics.add.group()

  //multiple pipes
  for (let i = 0; i < pipesToRender; i++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0,1);
    const downPipe = pipes.create(0, 0, "pipe").setOrigin(0,0);
    placePipe(upperPipe, downPipe);
  }

  pipes.setVelocityX(-200);

  this.input.on("pointerdown", birdFly);
  this.input.keyboard.on("keydown-SPACE", birdFly );
}

//FUNCTIONS

function placePipe(upPipe,LoPipe){
  const rightMostX = getRightMostPipe() 
  const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  const pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 -pipeVerticalDistance);
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

  upPipe.x = rightMostX + pipeHorizontalDistance;
  upPipe.y = pipeVerticalPosition;

  LoPipe.x= upPipe.x;
  LoPipe.y = upPipe.y + pipeVerticalDistance
}
const getRightMostPipe = ()=>{
  let rightMostX = 0;
  pipes.getChildren().forEach(pipe =>{
    rightMostX = Math.max(pipe.x, rightMostX)
  });
  return rightMostX;
}

const birdFly = function(){
  bird.body.velocity.y = flyVelocity;
}

const restartBirdPosition = function(){
  bird.x = initPosition.x;
  bird.y = initPosition.y;
  bird.body.velocity.y = 0;
}

function recyclePipes(){
  let pipesOut = [];
  pipes.getChildren().forEach((pipe)=>{
    if(pipe.getBounds().right <= 0){
      pipesOut.push(pipe);
      if(pipesOut.length ===2){
        placePipe(...pipesOut)
      }
    }
  })
}

//BUCLES
function update(time, delta){
  if(bird.y >= config.height || bird.y <= 0){
    restartBirdPosition();
  }
  recyclePipes();
}

const game = new Phaser.Game(config);
/* Una escena tambien se puede añadir con game.scene.add("BootScene", BootScene). Esto sirve si tengo las escenas importadas */