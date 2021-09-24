import Phaser from "phaser";
const pipesToRender = 15;


class PlayScene extends Phaser.Scene{
    constructor(config){
        super("PlayScene");
        this.config = config;

        this.bird;
        this.pipes;
    }

    preload(){
        this.load.image("sky", "assets/sky.png");
        this.load.image("bird", "assets/bird.png");
    }

    create(){
        this.add.image(0, 0, "sky" ).setOrigin(0);
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, "bird").setOrigin(0);
        this.bird.body.gravity.y = 800; 

        //PIPES
        this.pipes = this.physics.add.group()
        for (let i = 0; i < pipesToRender; i++) {
            const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0,1);
            const downPipe = pipes.create(0, 0, "pipe").setOrigin(0,0);
            this.placePipe(upperPipe, downPipe);
        }
        this.pipes.setVelocityX(-200);
    
        this.input.on("pointerdown", this.birdFly);
        this.input.keyboard.on("keydown-SPACE", this.birdFly );
    }

    update(){

    }
}

export default PlayScene;