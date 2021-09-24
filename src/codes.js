//En este caso se está añadiendo una escena directamente, si quiero poner más, tendría que hacer un array donde se carguen todas, importandolas de un archivo que yo defina  aparte
const config = {
  scenes:{
    preload,
    create,
    update
  }
}
//Si no, es así:
//scene: [PlayScene]
/* Una escena tambien se puede añadir con game.scene.add("BootScene", BootScene). Esto sirve si tengo las escenas importadas */


//esto puede ir dentro del update y sirve para hacer un conteo de los iframes cada un segundo.
//el delta de esta funcion, es contar la cantidad frames que se estan reproduciendo. El time, cuenta los milisegundos transcurridos.
let totalDelta = 0
if(totalDelta >= 1000){
    console.log(totalDelta);
    totalDelta = 0;
}
totalDelta += delta; 

//si quiero mover el pajaro de un lado al otro, con una cierta velocidad, teniendo en cuenta que se pasa de los extremos cuando este llega al borde, puedo plantear esta funcion en base a la posicion en x del pajaro.
bird.body.velocity.x = VELOCITY;

if(bird.x >= config.width - bird.width){
    bird.body.velocity.x = -VELOCITY;
    }else if(bird.x <= 0 ){
    bird.body.velocity.x = VELOCITY;
    }

//colision contra el mundo
this.physics.world.setBoundsCollision(true, true, true, false);

//colision de un objeto contra otro objeto
this.physics.add.collider(this.ball, this.platform);

//Si hay una gravedad, puedo contrarestarla y volar con una velocidad negativa

const fly = function(){
    bird.body.velocity.y = flyVelocity //-200;
  }

//Puedo hacer restart del juego reiniciando la posicion
const restartBirdPosition = function(){
    bird.x = initPosition.x;
    bird.y = initPosition.y;
    bird.body.velocity.y = 0;
  }

//Si quiero que un objeto no se caiga, lo puedo definir sin el physics:
pipe = this.add.sprite(300, 100, "pipe").setOrigin(0);

//Para localizar dos objetos uno arriba del otro, los pongo en una misma posicion pero con una distancia predeterminada entre ambos. El set origin elijo de que punto tomarlo
pipe = this.add.sprite(400, 200, "pipe").setOrigin(1,0);
pipe2 = this.add.sprite(400, pipe.y +100, "pipe").setOrigin(0,0);


//Distancia entre objetos aleatoria
const pipeVerticalDistanceRange = [150,250];
const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);

upperPipe = this.add.sprite(400, pipeVerticalPosition, "pipe").setOrigin(0,1);
downPipe = this.add.sprite(400, upperPipe.y + pipeVerticalDistance, "pipe").setOrigin(0,0);

//Posición vertical aleatoria de un objeto 
const pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 -pipeVerticalDistance);
const pipeVerticalPosition = Phaser.Math.Between(0, config.height);

//Posicion vertical aleatoria de multiples objetos distanciados

let pipeHorizontalPosition = 0;
const pipesToRender = 15;

for (let i = 0; i < pipesToRender; i++) {
    pipeHorizontalPosition += 200;

    const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 - pipeVerticalDistance);

    upperPipe = this.physics.add.sprite(pipeHorizontalPosition, pipeVerticalPosition, "pipe").setOrigin(0,1);

    downPipe = this.physics.add.sprite(upperpipe.x, upperPipe.y + pipeVerticalDistance, "pipe").setOrigin(0,0);
}

/////////PLACE PIPE REFACTOR///////////

//Es posible crear una función que se encargue exclusivamente de variar la posición de los objetos y la velocidad de los objetos, cosa que en el create solo quede la definición, y que con una función se aplique todo. Se definen los sprites dentro del create y después con un ciclo for se le aplican todas las propiedades

const upperPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0,1);
const downPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0,0);

const placePipe = (upPipe,LoPipe)=>{
  pipeHorizontalPosition += 200;
  const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  const pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 -pipeVerticalDistance);

  upPipe.x = pipeHorizontalPosition;
  upPipe.y = pipeVerticalPosition;

  LoPipe.x= upPipe.x;
  LoPipe.y = upPipe.y + pipeVerticalDistance
  
  upPipe.body.velocity.x = LoPipe.body.velocity.x = -100;
}

///////////SPRITE GROUPS//////////////

//Cuando hay funcionalidades que tengo que añadir a un grupo completo de sprites (en este caso todos los pipes), puedo añadir a create un grupo y a este añadirle todos los sprites que quiera.

const pipes = this.physics.add.group()

const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0,1);
const downPipe = pipes.create(0, 0, "pipe").setOrigin(0,0);

pipes.setVelocityX(-200);

//DISTANCIA HORIZONTAL DINAMICA
//Para añadir una distancia horizontal que vaya cambiando dinamicamente entre los pipes, voy a tener que tener en cuenta dos variables: La posición del último pipe agregado y un numero dentro de un rango de pixeles que se le sumará a está posición.

const getRightMostPipe = ()=>{
  let rightMostX = 0;
  pipes.getChildren().forEach(pipe =>{
    rightMostX = Math.max(pipe.x, rightMostX)
  });
  return rightMostX;
}

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

//RECICLAR PIPES: se ejecuta en update

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

/* SHARED CONFIG */
//Cuando uno tiene varias escenas, por lo general habrá variables dentro del config que se van a repetir en todas u algunas. Estas pueden ser el width y el height de la pantalla o también el posicionamiento del pajaro en este caso. Para compartir desde el index las configuraciones establecidas, se puede crear un objeto, el cual estará contenido en el config principal y tambien será pasado como parámetro dentro de la definición de la escena. Una vez que se hace esto, se puede acceder a este objeto desde la configuración propia de la escena con this.config = config. Cualquier parametro dentro del objeto voy a poder acceder con this.config.parametro

//objeto
const SHARED_CONFIG ={
  width: gwidth,
  height: gheight,
  startPosition: initPosition
}

//index config
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

//scene config
class PlayScene extends Phaser.Scene{
  constructor(config){
      super("PlayScene");
      this.config = config;

      this.bird;
  }
  preload(){
      this.load.image("sky", "assets/sky.png");
      this.load.image("bird", "assets/bird.png");
  }
  create(){
      this.add.image(0, 0, "sky" ).setOrigin(0);
      this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, "bird").setOrigin(0);
      this.bird.body.gravity.y = 800; 
  }
  update(){
  }
}

//En el archivo de la escena que cree, voy a tener que definir todos los sprites dentro de el archivo constructor, para que se encuentren durante toda la escena. Cuando se vayan a mensionar en el created, también hay que hacerlo con this. EL this sirve para referenciar al archivo constructor, que declara el contexto (creo). Todas las funciones y objetos que pertenezcan a la escena tienen que tener this. 
this.bird;
this.pipes;

/*REEEEEEEEEEEEEEEEEEEE IMPORTANTE: TODAS LAS FUNCIONES CREADAS DENTRO DEL CONSTRUCTOR NO LLEVAN FUNCTION. SE DEFINEN COMO NOMBRE(){} */

/* ///////////Primer refactorizacion:
La primer refactorizacion consistio en poder transladar toda la escena completa a un nuevo archivo. En este archivo, las variables se van a definir dentro de la funcion constructor en una clase que extiende la superclass. Dentro de la misma clase estaran todas las funciones, las cuales llamaran a las variables que esten definidas en el constructor mediante el prefijo this. (tambien utilizado en el constructor). En especial, hay variables dentro de la configuracion que se exportaran de la configuracion principal
*/
//Todo lo que se vaya a poner en el create o update esta buenos separarlo en funciones


/* COLIDERS */
function createColliders() {
  this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);// Los primeros dos parámetros indican los objetos que van a colisionar, el tercero una función que se ejecuta cuando colisionen, el 4to es el process callback y el último es el contexto en el que se va a ejecutar. 
}

/* WORLD BOUNDS COLIDERS
  Para que un objeto pueda colisionar contra el mundo, en la función que crea a este hay que añadirle un setCollideWorldBounds verdadero. En este caso, como quiero que cuando colisione el jugador pierda, el gameStatus a verificar será cuando el pajaro (con origen 0) sea igual a 0 o cuando el borde inferior del pajaro sea igual al ancho de la pantalla
*/

function createBird(){
  this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, "bird").setOrigin(0,0);
  this.bird.body.gravity.y = 800; 
  this.bird.setCollideWorldBounds(true)
}

function checkGameStatus(){
  if(this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0){
      this.gameOver();
  }
}

//PAUSE PHYSICS

//Para detener un objeto y que no sea afectado por la colision, en la definición del mismo objeto hay que ponerle un setImmotable verdadero (antes del setOrigin)
for (let i = 0; i < this.pipesToRender; i++) {
  const upperPipe = this.pipes.create(0, 0, "pipe")
  .setImmovable(true)
  .setOrigin(0,1)
  const downPipe = this.pipes.create(0, 0, "pipe")
  .setImmovable(true)
  .setOrigin(0,0);
  this.placePipe(upperPipe, downPipe);
}

//Para pausar el juego totalmente, se pueden pausar las fisicas accediendo a ellas, también se puede añadir una referencia de perder poniendole al bird un setTint(0xCOLORbinario)

function gameOver(){
  this.physics.pause();
  this.bird.setTint(0xEE1515);
}

/* RESTART THE GAME:

  Para reiniciar la escena, es posible ejecutar this.scene.restart() y lo que hará el phaser es re-ejecutar el create. Si quiero que se reinicie cuando hace game over, simplemente pudo meterlo adentro de this.time.addevent({delay:ms, restart(), loop:false (esto por defecto es verdadero, por lo que si no se pone se va a estar reiniciando todo el tiempo cada segundo)})
*/

function gameOver(){
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

