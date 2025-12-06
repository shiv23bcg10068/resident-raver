import { CONSTANTS } from '../utils/Constants';

export class Bullet {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.vx = data.vx;
    this.width = data.width;
    this.height = data.height;
    this.damage = 10;
    this.id = Date.now() + Math.random();
  }

  update() {
    this.x += this.vx;
  }

  isOffScreen() {
    return this.x < 0 || this.x > CONSTANTS.CANVAS_WIDTH;
  }

  draw(ctx) {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}