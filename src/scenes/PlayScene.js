import Phaser from "phaser";

class PlayScene extends Phaser.Scene{
    constructor(config){
        super("PlayScene");
        this.config = config;
        this.bird;
        this.pipes;
        this.pipesToRender = 15;
        this.pipeVerticalDistanceRange = [150,250];
        this.pipeHorizontalDistanceRange = [400, 500];
        this.pipeHorizontalDistance = 0;
        this.flyVelocity = 400;  
    }

    preload(){
        this.load.image("sky", "assets/sky.png");
        this.load.image("bird", "assets/bird.png");
        this.load.image("pipe", "/assets/pipe.png");
    }

    create(){
        this.createBG();
        this.createBird();
        this.createPipes();
        this.handlyEvents(); 
        this.createColliders();
    }

    update(){
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBG(){
        this.add.image(0, 0, "sky" ).setOrigin(0);
    }

    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, "bird").setOrigin(0,0);
        this.bird.body.gravity.y = 800; 
        this.bird.setCollideWorldBounds(true)
    }

    createPipes(){
        this.pipes = this.physics.add.group();
        for (let i = 0; i < this.pipesToRender; i++) {
            const upperPipe = this.pipes.create(0, 0, "pipe")
            .setImmovable(true)
            .setOrigin(0,1)
            const downPipe = this.pipes.create(0, 0, "pipe")
            .setImmovable(true)
            .setOrigin(0,0);
            this.placePipe(upperPipe, downPipe);
        }
        this.pipes.setVelocityX(-200);   
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    handlyEvents(){
        this.input.on("pointerdown", this.birdFly, this);
        this.input.keyboard.on("keydown-SPACE", this.birdFly, this);
    }
    
    placePipe(upPipe,LoPipe){
        const rightMostX = this.getRightMostPipe() 
        const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
        const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 -pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
    
        upPipe.x = rightMostX + pipeHorizontalDistance;
        upPipe.y = pipeVerticalPosition;
    
        LoPipe.x= upPipe.x;
        LoPipe.y = upPipe.y + pipeVerticalDistance;
    }
    
    recyclePipes(){
        let pipesOut = [];
        this.pipes.getChildren().forEach((pipe)=>{
            if(pipe.getBounds().right <= 0){
                pipesOut.push(pipe);
                if(pipesOut.length ===2){
                    this.placePipe(...pipesOut)
                }
            }
        })
    }

    getRightMostPipe(){
        let rightMostX = 0;
        this.pipes.getChildren().forEach((pipe) =>{
        rightMostX = Math.max(pipe.x, rightMostX)
        });
        return rightMostX;
    } 
    
    gameOver(){
        this.physics.pause();
        this.bird.setTint(0xEE1515);

        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.scene.restart()
            },
            loop: false
        })
    }
    
    birdFly(){
        this.bird.body.velocity.y = -this.flyVelocity;
    }    

    checkGameStatus(){
        if(this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0){
            this.gameOver();
        }
    }
}

export default PlayScene;