import BaseScene from "./BaseScene.js";

class ScoreScene extends BaseScene 
{
    constructor(config){
        super("ScoreScene", {...config, canGoBack: true});
    }


    create(){
        super.create()
        const bestScore = localStorage.getItem("bestScore")
        this.add.text(...this.screenCenter, `Best score: ${bestScore || 0}`, this.fontOptions).setOrigin(0.5);
    }

    

    update(){

    }

}

export default ScoreScene;