import { CONSTANTS } from '../utils/Constants';

export class Grenade {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.vx = data.vx;
    this.vy = data.vy;
    this.radius = data.radius;
    this.bounces = data.bounces;
    this.maxBounces = 3;
    this.bounciness = 0.6;
    this.damage = 30;
    this.id = Date.now() + Math.random();
  }

  update() {
    this.vy += CONSTANTS.GRAVITY;
    this.x += this.vx;
    this.y += this.vy;

    // Ground collision
    if (this.y >= CONSTANTS.GROUND_Y) {
      this.y = CONSTANTS.GROUND_Y;
      this.vy *= -this.bounciness;
      this.bounces++;
    }
  }

  shouldExplode() {
    return this.bounces >= this.maxBounces;
  }

  draw(ctx) {
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw fuse
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 3, this.y - 8);
    ctx.stroke();
  }
}