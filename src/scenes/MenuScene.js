import Phaser from "phaser";

class MenuScene extends Phaser.Scene{
    constructor(config){
        super("MenuScene");
        this.config = config;

    }

    preload(){
        this.load.image("sky", "assets/sky.png");
    }

    create(){
        this.createBG();
        this.createStartButton();
        
    }

    update(){

    }

    createBG(){
        this.add.image(0, 0, "sky" ).setOrigin(0);
    }

    createStartButton(){
        const startButton = this.add.text(this.config.width/2, this.config.height/2, `Start Game`, { fontSize: "32px", fill: "#000" });
        startButton.on("pointerdown",()=>{
            this.scene.start("PlayScene");
        })
    }


}

export default MenuScene;
