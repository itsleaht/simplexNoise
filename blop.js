let canvas = document.getElementById('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d'),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    simplex = new SimplexNoise(),
    particles = [],
    particlesLength,
    lastCoords,
    lastIndex,
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

function Particle (angle, radius) {
    this.center = {
      x : canvasWidth / 2,
      y : canvasHeight / 2
    };

    this.amplitude = 50;
    this.noise = 0;

    this.angle = angle;
    this.radius = radius;

    this.color = getRandomColor();

    this.noise = simplex.noise2D(Math.cos(this.angle), Math.sin(this.angle)) * this.amplitude;

    this.x = this.center.x + Math.cos(this.angle) * (this.radius + this.noise);
    this.y = this.center.y + Math.sin(this.angle) * (this.radius + this.noise);
}

Particle.prototype = {
    render : function() {

      if (!lastCoords) {
          lastCoords = {
           x : this.x,
           y : this.y
          }
      }

      ctx.beginPath();
      ctx.save();

      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);

      ctx.strokeStyle = this.color;
      ctx.moveTo(lastCoords.x, lastCoords.y);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      ctx.fill();

      lastCoords = {
        x : this.x,
        y : this.y
      }

      ctx.restore();
      ctx.closePath();
    },

    update : function () {
      time += 0.000025;
      this.noise = simplex.noise2D(Math.cos(this.angle) + time, Math.sin(this.angle) + time) * this.amplitude;
      this.x = this.center.x + Math.cos(this.angle) * (this.radius + this.noise);
      this.y = this.center.y + Math.sin(this.angle) * (this.radius + this.noise);
    }
}


function init() {

  for (let i = 0; i < Math.PI * 2; i += 0.1) {
      let angle = i;

      let particle = new Particle(angle, 250);

      particle.render();
      particles.push(particle);
  }

  particlesLength = particles.length,
  lastIndex = particlesLength - 1;

  drawLastToFirst();
};

function updateFrame() {

  requestAnimationFrame(updateFrame);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  lastCoords = [];
  for (let i = 0; i < particlesLength; i++){
      let p = particles[i];
      p.update();
      p.render();
  }

  drawLastToFirst();
}

function drawLastToFirst() {
  ctx.beginPath();
  ctx.save();
  ctx.strokeStyle = '#fff';
  ctx.moveTo(particles[0].x, particles[0].y);
  ctx.lineTo(particles[lastIndex].x, particles[lastIndex].y);
  ctx.stroke();
  ctx.restore();
  ctx.closePath();
}

init();
updateFrame();
