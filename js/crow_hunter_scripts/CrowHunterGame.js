//to make VS CODE suggest canvas methods
/** @type {HTMLCanvasElement} */

//CROW HUNTER GAME WITH COLOR COLLISION DETECTION
const canvas = document.getElementById("canvas1");
//context
const ctx = canvas.getContext("2d");
//console.log(ctx);
//global variable in capital
//scaling
/*const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);*/
//to get canvas postion
const canvasPosition = canvas.getBoundingClientRect();
//POINT AND SHOOT GAME -----------------------------------------------------------------------------------------
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 20 / 100;
/*canvas.width = canvas.width;
canvas.height = canvas.height;*/
const collisionCanvas = document.getElementById("collisionCanvas");
//context
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight - 20 / 100;
/*collisionCanvas.width = canvas.width;
collisionCanvas.height = canvas.height;*/

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
    this.image.src = "../assets/images/crowhunter/raven.png";
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
    this.image.src = "../assets/images/crowhunter/boom.png";
    this.frame = 0;
    //stagger the animation frame
    this.timer = 0;
    this.sound = new Audio();
    this.sound.src = "../assets/audio/crowhunter/boom.wav";
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

//particles behind each raven
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
