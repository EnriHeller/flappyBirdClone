import BaseScene from "./BaseScene.js";

class PlayScene extends BaseScene{
    constructor(config){
        super("PlayScene", config);
        this.bird;
        this.pipes;
        this.isPaused = false;
        
        this.pipesToRender = 15;

        this.pipeVerticalDistanceRange = [150,250];
        this.pipeHorizontalDistanceRange = [400, 500];
        this.pipeHorizontalDistance = 0;
        this.flyVelocity = 400;  

        this.score;
        this.scoreText

        this.currentDifficulty = "easy";
        this.difficulties = {
            "easy":{
                pipeHorizontalDistanceRange: [280, 450],
                pipeVerticalDistanceRange: [150, 200]
            },
            "normal":{
                pipeHorizontalDistanceRange: [280, 330],
                pipeVerticalDistanceRange: [140, 190]
            },
            "hard":{
                pipeHorizontalDistanceRange: [200, 250],
                pipeVerticalDistanceRange: [120, 170]
            },
        }
    }

    create(){
        this.currentDifficulty = "easy";
        super.create();
        this.createBird();
        this.createPipes();
        this.createPause();
        this.createColliders();
        this.createScore();
        this.handleEvents(); 
        this.listenToEvents()

        this.anims.create({
            key:"fly",
            frames: this.anims.generateFrameNumbers("bird", {start: 8, end: 15}),
            frameRate: 8,
            repeat: -1
        })

        this.bird.play("fly");
    }

    update(){
        this.checkGameStatus();
        this.recyclePipes();
    }

    listenToEvents(){
        if(this.pauseEvent) {return;}

        this.pauseEvent = this.events.on('resume', () => {
            this.initialTime = 3;
            this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true
            })
        })
    } 

    countDown() {
        this.initialTime--;
        this.countDownText.setText('Fly in: ' + this.initialTime);
        if (this.initialTime <= 0) {
            this.isPaused = false;
            this.countDownText.setVisible(false);
            this.physics.resume();
            this.timedEvent.remove();
        }
    }

    createBG(){
        this.add.image(0, 0, "sky" ).setOrigin(0);
    }
    createPause(){
        this.isPaused = false;
        const pauseButton = this.add.image(this.config.width - 10, this.config.height-10, "pause")
            .setOrigin(1,1)
            .setScale(3)
            .setInteractive();

        pauseButton.on('pointerdown', this.pauseGame, this);

        this.input.keyboard.on('keydown-P', this.pauseGame, this);
    }

    pauseGame(){
        this.isPaused = true;
        this.physics.pause();
        this.scene.pause();
        this.scene.launch('PauseScene');
    }

    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
        .setScale(3)
        .setOrigin(0,0)
        .setFlipX(true);
        this.bird.setBodySize(this.bird.width, this.bird.height - 8);
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

    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem("bestScore")
        this.scoreText = this.add.text(16, 16, `Score: ${0}`, { fontSize: "32px", fill: "#000" });
        this.add.text(16, 46  , `Best score: ${bestScore || 0}`, { fontSize: "18px", fill: "#000"});
    }

    handleEvents(){
        this.input.on("pointerdown", this.birdFly, this);
        this.input.keyboard.on("keydown-SPACE", this.birdFly, this);
    }
    
    placePipe(upPipe,LoPipe){
        const difficulty = this.difficulties[this.currentDifficulty];
        const rightMostX = this.getRightMostPipe() 
        const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
        const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 -pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);
    
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
                    this.increaseScore()   
                    this.saveBestScore()
                    this.increaseDifficulty()
                }
            }
        })
    }

    increaseDifficulty(){
        if(this.score === 2){
            this.currentDifficulty = "normal";
        }

        if(this.score === 3){
            this.currentDifficulty = "hard";
        }
    }

    getRightMostPipe(){
        let rightMostX = 0;
        this.pipes.getChildren().forEach((pipe) =>{
        rightMostX = Math.max(pipe.x, rightMostX)
        });
        return rightMostX;
    } 
    
    saveBestScore(){
        const bestScoreText = localStorage.getItem("bestScore");
        const bestScore = bestScoreText && parseInt(bestScoreText,10)

        if(!bestScore || this.score>bestScore){
            localStorage.setItem("bestScore", this.score)
        }
    }

    gameOver(){
        this.physics.pause();
        this.bird.setTint(0xEE1515);

        this.saveBestScore();

        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.scene.restart()
            },
            loop: false
        })
    }
    
    birdFly(){
        if(this.isPaused){return;}
        this.bird.body.velocity.y = -this.flyVelocity;
    }    

    increaseScore(){
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`)
    }

    checkGameStatus(){
        if(this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0){
            this.gameOver();
        }
    }
}

export default PlayScene;