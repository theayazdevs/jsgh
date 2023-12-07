//to make VS CODE suggest canvas methods
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
//context
const ctx = canvas.getContext("2d");
console.log(ctx);
//global variable in capital
//scaling
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);
//player image to animate spritesheet with js
const playerImage = new Image();
playerImage.src = "../assets/images/jungleman/player/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;
//which action by player
let playerState = "idle";
//options
const dropdown = document.getElementById("animations");
//listen for change
dropdown.addEventListener("change", function (e) {
  playerState = e.target.value;
});
//sprite animations
const spriteAnimations = [];
const animationStates = [
  {
    name: "idle",
    frames: 7,
  },
  {
    name: "jump",
    frames: 7,
  },
  {
    name: "fall",
    frames: 7,
  },
  {
    name: "run",
    frames: 9,
  },
  {
    name: "dizzy",
    frames: 11,
  },
  {
    name: "sit",
    frames: 5,
  },
  {
    name: "roll",
    frames: 7,
  },
  {
    name: "bite",
    frames: 7,
  },
  {
    name: "ko",
    frames: 12,
  },
  {
    name: "getHit",
    frames: 4,
  },
];
animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  };
  for (let j = 0; j < state.frames; j++) {
    let positionX = j * spriteWidth;
    let positionY = index * spriteHeight;
    frames.loc.push({ x: positionX, y: positionY });
  }
  spriteAnimations[state.name] = frames;
});
console.log(spriteAnimations);
//go through sprite sheet row horizontally
//let frameX = 0;
//go through sprite sheet row vertically
//let frameY = 0;
//to slow the animation
let gameFrame = 0;
//slow animation by that amount
const staggerFrames = 5;
//animate something
function animate() {
  //clear old paint from canvas between every animation frame
  //what area to clear on the canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //let position = Math.floor(gameFrame / staggerFrames) % 6;
  //dynamic frames from spritesheet
  //let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations["sit"].loc.length;
  let position =
    Math.floor(gameFrame / staggerFrames) %
    spriteAnimations[playerState].loc.length;
  let frameX = spriteWidth * position;
  //let frameY = spriteAnimations["sit"].loc[position].y;
  let frameY = spriteAnimations[playerState].loc[position].y;
  //s=source, d=destination
  //sx, sy, sw, sh = area we cut out from the original spritesheet
  //0, 0, CANVAS_WIDTH, CANVAS_HEIGHT = where on canvas we want to place that cut out image
  //ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  //ctx.drawImage(playerImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //ctx.drawImage(playerImage, 0, 0, spriteWidth, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //sx=x*sprite width allows change in sprite sheet image in the current row
  //sy=y*spriteHeight allows movement to the next row
  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );
  /*if (gameFrame % staggerFrames == 0) {
    //increase frame X
    if (frameX < 6) {
      frameX++;
    } else {
      frameX = 0;
    }*/

  gameFrame++;
  //runs the function passed
  requestAnimationFrame(animate);
}
//animate();

//  PARALLAX ---------------------------------------------------------------------------------------------------------------
// let is used when value is to be reassigned
let gameSpeed = 5;
//let gameFrameP = 0;
//bringing layers into the project
const backgroundLayer1 = new Image();
backgroundLayer1.src = "../assets/images/jungleman/parallax/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "../assets/images/jungleman/parallax/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "../assets/images/jungleman/parallax/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "../assets/images/jungleman/parallax/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "../assets/images/jungleman/parallax/layer-5.png";

//make sure all images are loaded before starting the game
window.addEventListener("load", function () {
  const slider = document.getElementById("slider");
  slider.value = gameSpeed;
  const showGameSpeed = document.getElementById("showGameSpeed");
  showGameSpeed.innerHTML = gameSpeed;
  slider.addEventListener("change", function (e) {
    console.log(e.target.value);
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = e.target.value;
  });

  //custom class
  class Layer {
    constructor(image, speedModifier) {
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 700;
      //this.x2 = this.width;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = gameSpeed * this.speedModifier;
    }
    update() {
      this.speed = gameSpeed * this.speedModifier;
      if (this.x <= -this.width) {
        //this.x = this.width + this.x2 - this.speed;
        //this.x = this.width - this.speed;
        this.x = 0;
      }
      /*if (this.x2 <= -this.width) {
        this.x2 = this.width + this.x - this.speed;
      }*/
      //this.x = Math.floor(this.x - this.speed);
      //this.x = this.x - this.speed;
      //this.x2 = Math.floor(this.x2 - this.speed);
      //to replace the code above, but the issue is that the animation is not that accurate
      //a cycle from 0 to the width
      //this.x = (gameFrameP * this.speed) % this.width;
      this.x = this.x - this.speed;
    }
    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      //ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
    }
  }
  const layer1 = new Layer(backgroundLayer1, 0.2);
  const layer2 = new Layer(backgroundLayer2, 0.4);
  const layer3 = new Layer(backgroundLayer3, 0.6);
  const layer4 = new Layer(backgroundLayer4, 0.8);
  const layer5 = new Layer(backgroundLayer5, 1);

  const gameObjects = [layer1, layer2, layer3, layer4, layer5];

  function animateParallax() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach((obj) => {
      obj.update();
      obj.draw();
    });
    //gameFrameP--;
    requestAnimationFrame(animateParallax);
  }
  //animateParallax();
});

//  ENEMIES  ---------------------------------------------------------------------------------------------------------------

//images
/*const enemyImage = new Image();
enemyImage.src = "../assets/images/jungleman/enemies/enemy1.png";*/
let gameFrameE = 0;

//blueprint
/*enemy1 = {
  x: 10,
  y: 50,
  width: 100,
  height: 100,
};*/
class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "../assets/images/jungleman/enemies/enemy1.png";
    //this.speed = Math.random() * 4 - 2;
    this.spriteWidthE = 293;
    this.spriteHeightE = 155;
    this.width = this.spriteWidthE / 2.5;
    this.height = this.spriteHeightE / 2.5;
    //this.x = 10;
    this.x = Math.random() * (canvas.width - this.width);
    //this.y = 50;
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
  }
  update() {
    //horizontal
    //this.x++;
    //this.x += this.speed;
    this.x += Math.random() * 5 - 2.5;
    ///vertical
    //this.y++;
    //this.y += this.speed;
    this.y += Math.random() * 5 - 2.5;
    //this.frame > 4 ? (this.frame = 0) : this.frame++;
    /*if (gameFrameE % 2 === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }*/
    if (gameFrameE % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }
  draw() {
    //ctx.fillRect(enemy1.x, enemy1.y, enemy1.width, enemy1.height);
    //ctx.fillRect(this.x, this.y, this.width, this.height);
    //ctx.strokeRect(this.x, this.y, this.width, this.height);
    /*ctx.drawImage(
      enemyImage,
      0,
      0,
      this.spriteWidthE,
      this.spriteHeightE,
      this.x,
      this.y,
      this.width,
      this.height
    );*/
    /*ctx.drawImage(
      enemyImage,
      this.frame * this.spriteWidthE,
      0,
      this.spriteWidthE,
      this.spriteHeightE,
      this.x,
      this.y,
      this.width,
      this.height
    );*/
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidthE,
      0,
      this.spriteWidthE,
      this.spriteHeightE,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
const numberOfEnemies = 100;
const enemiesArray = [];
//const enemy1 = new Enemy();
for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArray.push(new Enemy());
}
console.log(enemiesArray);
function animateE() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //enemy1.update();
  //enemy1.draw();
  enemiesArray.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });
  gameFrameE++;
  requestAnimationFrame(animateE);
}
animateE();
