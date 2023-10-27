const canvas = document.getElementById("jungleman_canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 823);
const CANVAS_HEIGHT = (canvas.height = 800);

const back = document.getElementById("back");
const ground = document.getElementById("ground");
const grass = document.getElementById("grass");
const tree = document.getElementById("tree");
const junglebehind = document.getElementById("junglebehind");

let x = 0;
let x2 = 823;
const movSpeed = 5;

class Layer {
  constructor(image, movSpeed, y_Position) {
    this.x = 0;
    this.y = y_Position;
    this.width = 823;
    this.height = 800;
    this.x2 = this.width;
    this.image = image;
    this.speedModifier = movSpeed;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y);
    ctx.drawImage(this.image, this.x2, this.y);
  }

  update() {
    if (this.x < -823) {
      this.x = 823 - this.speedModifier + this.x2;
    } else {
      this.x -= this.speedModifier;
    }

    if (this.x2 < -823) {
      this.x2 = 823 - this.speedModifier + this.x;
    } else {
      this.x2 -= this.speedModifier;
    }
  }
}
const BackLayer = new Layer(back, 0.5, 160);
const GroundLayer = new Layer(ground, 2.5, 160);
const GrassLayer = new Layer(grass, 1, 160);
const TreeLayer = new Layer(tree, 1, 20);
const JungleBehindLayer = new Layer(junglebehind, 0.5, 0);

const gameObjects = [BackLayer, JungleBehindLayer, GrassLayer, GroundLayer];

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gameObjects.forEach((obj) => {
    obj.update();
    obj.draw();
  });
  requestAnimationFrame(animate);
}
animate();
