import { CONSTANTS, ENTITY_TYPES, COLLISION_TYPES } from '../utils/Constants';

export class Zombie {
  constructor(x, y, direction = 1) {
    this.x = x;
    this.y = y;
    this.vx = direction * CONSTANTS.ZOMBIE_SPEED;
    this.width = CONSTANTS.ZOMBIE_SIZE.width;
    this.height = CONSTANTS.ZOMBIE_SIZE.height;
    this.health = 30;
    this.maxHealth = 30;
    this.flip = direction < 0;
    this.type = ENTITY_TYPES.ENEMY;
    this.collides = COLLISION_TYPES.PASSIVE;
  }

  update() {
    this.x += this.vx;

    // Turn around at boundaries
    if (this.x < 50 || this.x > CONSTANTS.CANVAS_WIDTH - 50) {
      this.vx *= -1;
      this.flip = !this.flip;
    }
  }

  receiveDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }

  draw(ctx) {
    // Draw zombie body
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 5, this.y + 8, 4, 4);
    ctx.fillRect(this.x + 11, this.y + 8, 4, 4);

    // Draw health bar
    const healthBarWidth = this.width;
    const healthBarHeight = 3;
    const healthPercentage = this.health / this.maxHealth;

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.x, this.y - 8, healthBarWidth, healthBarHeight);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x, this.y - 8, healthBarWidth * healthPercentage, healthBarHeight);
  }
}