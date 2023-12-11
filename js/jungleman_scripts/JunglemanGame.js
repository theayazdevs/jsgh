//to make VS CODE suggest canvas methods
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
//context
const ctx = canvas.getContext("2d");
//console.log(ctx);
//global variable in capital
//scaling
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);
//to get canvas postion
const canvasPosition = canvas.getBoundingClientRect();
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
//console.log(spriteAnimations);
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
    //console.log(e.target.value);
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
//console.log(enemiesArray);
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
//animateE();

//EXPLOSION and SOUND ---------------------------------------------------------------------------------------
//ctx.fillStyle = "black";
//ctx.fillRect(0, 0, canvas.width, canvas.height);
const explosions = [];
class Explosion {
  //x and y co-ordinates to show the location of explosion
  // or can be used to show where the mouse clicked
  constructor(x, y) {
    this.spriteWidthEx = 200;
    this.spriteHeightEx = 179;
    //for aspect ratio
    this.width = this.spriteWidthEx / 2;
    this.height = this.spriteHeightEx / 2;
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
    this.image = new Image();
    this.image.src = "../assets/images/jungleman/enemies/boom.png";
    this.frame = 0;
    //stagger the animation frame
    this.timer = 0;
    this.sound = new Audio();
    this.sound.src = "../assets/audio/jungleman/boom.wav";
  }
  update() {
    //play only once
    if (this.frame === 0) {
      this.sound.play();
    }
    this.timer++;
    //run this code every 10 frames
    //so animation speed 10 times slower to show all frames in a sprite sheet
    if (this.timer % 10 === 0) {
      this.frame++;
    }
    //this.frame++;
  }
  draw() {
    //for frames longest argument of the draw method is used
    //ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    //sx is complex to calculate = this.spriteWidth*this.frame
    //sy is for multiple rows, but in this case there is only 1 row so = 0
    ctx.drawImage(
      this.image,
      this.spriteWidthEx * this.frame,
      0,
      this.spriteWidthEx,
      this.spriteHeightEx,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
window.addEventListener("click", function (e) {
  //let positionXEx = e.x - canvasPosition.left;
  //let positionYEx = e.y - canvasPosition.top;
  //console.log(e);
  /*ctx.fillRect(
    e.x - canvasPosition.left - 25,
    e.y - canvasPosition.top - 25,
    50,
    50
  );*/
  //ctx.fillRect(positionXEx, positionYEx, 50, 50);
  //explosions.push(new Explosion(positionXEx, positionYEx));
  createAnimation(e);
});

function createAnimation(e) {
  let positionXEx = e.x - canvasPosition.left;
  let positionYEx = e.y - canvasPosition.top;
  //console.log(e);
  /*ctx.fillRect(
    e.x - canvasPosition.left - 25,
    e.y - canvasPosition.top - 25,
    50,
    50
  );*/
  //ctx.fillRect(positionXEx, positionYEx, 50, 50);
  explosions.push(new Explosion(positionXEx, positionYEx));
}

function animateEx() {
  //to see only the current frame
  //clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();
    if (explosions[i].frame > 5) {
      //remove 1 object ath the given index
      explosions.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animateEx);
}
//animateEx();

//POINT AND SHOOT GAME -----------------------------------------------------------------------------------------
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById("collisionCanvas");
//context
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

//score
let score = 0;
let gameOver = false;
//set global canvas font
ctx.font = "50px Impact";

let ravens = [];
class Raven {
  constructor() {
    //width of a single raven frame
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = "../assets/images/jungleman/enemies/raven.png";
    //counting number of frames in the spritesheet
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    //this.flapInterval = 100;
    this.flapInterval = Math.random() * 50 + 100;
    //colors for hitbox
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
  }
  update(deltaTime) {
    //add bounce on top and bottom of screen
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.f = this.directionY * -1;
    }
    this.x -= this.directionX;
    //move some ravens up and down
    this.y += this.directionY;
    //if it has moved all the way to the left
    if (this.x < 0 - this.width) {
      this.markedForDeletion = true;
    }
    this.timeSinceFlap += deltaTime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) {
        this.frame = 0;
      } else {
        this.frame++;
        this.timeSinceFlap = 0;
        //particles.push(new Particle(this.x, this.y, this.width, this.color));
        //for limited particles
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(this.x, this.y, this.width, this.color));
        }
      }
    }
    /*if (this.frame > this.maxFrame) {
      this.frame = 0;
    } else {
      this.frame++;
    }*/
    //if a raven manages to get past the width then game over
    if (this.x < 0 - this.width) {
      gameOver = true;
    }
  }
  draw() {
    //ctx.fillRect(this.x, this.y, this.width, this.height);
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

//EXPLOSION ANIMATION
let explosions2 = [];
class ExplosionTwo {
  //x and y co-ordinates to show the location of explosion
  // or can be used to show where the mouse clicked
  constructor(x, y, size) {
    this.spriteWidthEx = 200;
    this.spriteHeightEx = 179;
    this.size = size;
    //for aspect ratio
    //this.width = this.spriteWidthEx / 2;
    //this.height = this.spriteHeightEx / 2;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "../assets/images/jungleman/enemies/boom.png";
    this.frame = 0;
    //stagger the animation frame
    this.timer = 0;
    this.sound = new Audio();
    this.sound.src = "../assets/audio/jungleman/boom.wav";
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.markedForDeletion = false;
  }
  update(deltaTime) {
    this.timeSinceLastFrame += deltaTime;
    //play only once
    /*if (this.frame === 0) {
      this.sound.play();
    }
    this.timer++;
    //run this code every 10 frames
    //so animation speed 10 times slower to show all frames in a sprite sheet
    if (this.timer % 10 === 0) {
      this.frame++;
    }
    //this.frame++;
    */
    if (this.frame === 0) {
      this.sound.play();
    }
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) {
        this.markedForDeletion = true;
      }
    }
  }
  draw() {
    //for frames longest argument of the draw method is used
    //ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    //sx is complex to calculate = this.spriteWidth*this.frame
    //sy is for multiple rows, but in this case there is only 1 row so = 0
    ctx.drawImage(
      this.image,
      this.spriteWidthEx * this.frame,
      0,
      this.spriteWidthEx,
      this.spriteHeightEx,
      this.x,
      this.y - this.size / 4,
      this.size,
      this.size
    );
  }
}

let particles = [];
class Particle {
  constructor(x, y, size, color) {
    this.size = size;
    this.x = x + this.size / 2;
    this.y = y + this.size / 3;

    this.radius = (Math.random() * this.size) / 10;
    this.maxRadius = Math.random() * 20 + 35;
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.color = color;
  }
  update() {
    this.x += this.speedX;
    this.radius += 0.2;
    if (this.radius > this.maxRadius) {
      this.markedForDeletion = true;
    }
  }
  draw() {
    //to only affect particles and not raven
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
}
function drwaGameOver() {
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(
    "GAMEOVER, Your Score is: " + score,
    canvas.width / 2,
    canvas.height / 2
  );
}
window.addEventListener("click", function (e) {
  //collision detection by color
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
  //pixel color data array
  const pc = detectPixelColor.data;
  ravens.forEach((object) => {
    if (
      object.randomColors[0] === pc[0] &&
      object.randomColors[1] === pc[1] &&
      object.randomColors[2] === pc[2]
    ) {
      object.markedForDeletion = true;
      score++;
      explosions2.push(new ExplosionTwo(object.x, object.y, object.width));
    }
  });
});

//const raven = new Raven();
//timstamp to make the game run equally on slower or faster machines
function animatePS(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  //console.log(timestamp);
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    //every 500 ms a new raven object is added to the ravens array
    ravens.push(new Raven());
    timeToNextRaven = 0;
    //console.log(ravens);
    //sort in ascending order based on width
    ravens.sort(function (a, b) {
      //to draw small ones first and then large ravens
      return a.width - b.width;
    });
  }
  //console.log(deltaTime);
  //first draw score, so it stays behind ravens
  drawScore();
  // ... spread operator, allows expansion of one array to another
  [...particles, ...ravens, ...explosions2].forEach((object) =>
    object.update(deltaTime)
  );
  [...particles, ...ravens, ...explosions2].forEach((object) => object.draw());
  //only contains the ravens that are active and on the screen
  ravens = ravens.filter((object) => !object.markedForDeletion);
  explosions2 = explosions2.filter((object) => !object.markedForDeletion);
  particles = particles.filter((object) => !object.markedForDeletion);
  //console.log(ravens);
  //requestAnimationFrame(animatePS);
  if (!gameOver) {
    requestAnimationFrame(animatePS);
  } else {
    drwaGameOver();
  }
}
animatePS(0);
