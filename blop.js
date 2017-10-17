let canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d'),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    simplex = new SimplexNoise(),
    lastCoords,
    value2d,
    blops = [],
    amplitude = 30,
    delta
    time = 0;

const color = [
  '#b4aef7',
  '#64deeb',
  '#646eee',
  '#ee9cdf'
];

function getRandom(min, max){
  return Math.floor(Math.random() * max + min);
}

function getRandomColor() {
    const index = getRandom(0,color.length);
    return color[index];
}

function Blop (angle, radius) {
  this.angle = angle;
  this.radius = radius;


  this.x = canvasWidth / 2 + Math.cos(this.angle) * (this.radius);
  this.y = canvasHeight / 2 + Math.sin(this.angle) * (this.radius);

  this.value2d = simplex.noise2D(this.x , this.y) * amplitude;


  this.x = canvasWidth / 2 + Math.cos(this.angle) * (this.radius  + this.value2d);
  this.y = canvasHeight / 2 + Math.sin(this.angle) * (this.radius  + this.value2d);

  if (!lastCoords) {
    lastCoords = {
      x : this.x,
      y : this.y
    }
  }

  Blop.prototype.render = function () {
    ctx.beginPath();
    ctx.save();

    ctx.fillStyle = getRandomColor();
    ctx.arc(this.x, this.y, 2, 0, Math.PI*2);

    ctx.moveTo(lastCoords.x, lastCoords.y);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.fill();

    ctx.restore();
    ctx.closePath();

    lastCoords = {
      x : this.x,
      y : this.y
    }
  }

  Blop.prototype.update = function () {
    time += 0.000025;
    this.value2d = simplex.noise2D(Math.cos(this.angle) + time, Math.sin(this.angle) + time) * amplitude;
    this.x = canvasWidth / 2 + Math.cos(this.angle) * (this.radius  + this.value2d);
    this.y = canvasHeight / 2 + Math.sin(this.angle) * (this.radius  + this.value2d);
  }
}

function init() {

    let value2d,
        angle = 0;
    const radius = 200;

    for(let i = 0; i < (Math.PI * 2); i+=0.05) {
      angle += 0.05;
      blop = new Blop(angle, 200, value2d);
      blops.push(blop);
    }
}

function updateFrame() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < blops.length; i++) {
      let b = blops[i];
      b.update();
      b.render();
    }

  requestAnimationFrame(updateFrame);
}

init();
updateFrame();
