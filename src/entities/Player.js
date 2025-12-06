import { CONSTANTS, ENTITY_TYPES, COLLISION_TYPES } from '../utils/Constants';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = CONSTANTS.PLAYER_SIZE.width;
    this.height = CONSTANTS.PLAYER_SIZE.height;
    this.health = 100;
    this.maxHealth = 100;
    this.weapon = 0; // 0 = gun, 1 = grenade
    this.totalWeapons = 2;
    this.flip = false;
    this.invincible = true;
    this.invincibleTimer = CONSTANTS.INVINCIBILITY_DURATION;
    this.startPosition = { x, y };
    this.type = ENTITY_TYPES.FRIENDLY;
    this.collides = COLLISION_TYPES.PASSIVE;
    this.isGrounded = false;
  }

  update(keys, deltaTime = 1) {
    // Update invincibility
    if (this.invincible) {
      this.invincibleTimer -= deltaTime * 0.016;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    // Horizontal movement
    if (keys['ArrowLeft']) {
      this.vx = -CONSTANTS.PLAYER_SPEED;
      this.flip = true;
    } else if (keys['ArrowRight']) {
      this.vx = CONSTANTS.PLAYER_SPEED;
      this.flip = false;
    } else {
      this.vx = 0;
    }

    // Jumping
    if (keys['x'] && this.isGrounded) {
      this.vy = -CONSTANTS.JUMP_STRENGTH;
      this.isGrounded = false;
    }

    // Apply gravity
    this.vy += CONSTANTS.GRAVITY;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Ground collision
    if (this.y >= CONSTANTS.GROUND_Y) {
      this.y = CONSTANTS.GROUND_Y;
      this.vy = 0;
      this.isGrounded = true;
    }

    // Boundary checking
    if (this.x < 0) this.x = 0;
    if (this.x > CONSTANTS.CANVAS_WIDTH - this.width) {
      this.x = CONSTANTS.CANVAS_WIDTH - this.width;
    }
  }

  switchWeapon() {
    this.weapon = (this.weapon + 1) % this.totalWeapons;
  }

  shoot() {
    const projectile = {
      x: this.x + (this.flip ? -10 : this.width + 10),
      y: this.y + 10,
      type: this.weapon === 0 ? 'bullet' : 'grenade',
      flip: this.flip,
    };

    if (this.weapon === 0) {
      // Bullet
      return {
        ...projectile,
        vx: this.flip ? -CONSTANTS.BULLET_SPEED : CONSTANTS.BULLET_SPEED,
        vy: 0,
        width: CONSTANTS.BULLET_SIZE.width,
        height: CONSTANTS.BULLET_SIZE.height,
      };
    } else {
      // Grenade
      return {
        ...projectile,
        vx: this.flip ? -CONSTANTS.GRENADE_SPEED : CONSTANTS.GRENADE_SPEED,
        vy: -8,
        bounces: 0,
        radius: CONSTANTS.GRENADE_SIZE.radius,
      };
    }
  }

  receiveDamage(amount) {
    if (this.invincible) return false;

    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      return true; // Player died
    }

    // Make invincible after taking damage
    this.invincible = true;
    this.invincibleTimer = CONSTANTS.INVINCIBILITY_DURATION;
    return false;
  }

  respawn() {
    this.x = this.startPosition.x;
    this.y = this.startPosition.y;
    this.vx = 0;
    this.vy = 0;
    this.health = this.maxHealth;
    this.invincible = true;
    this.invincibleTimer = CONSTANTS.INVINCIBILITY_DURATION;
  }

  draw(ctx) {
    const alpha = this.invincible 
      ? Math.max(0.3, 1 - (CONSTANTS.INVINCIBILITY_DURATION - this.invincibleTimer) / CONSTANTS.INVINCIBILITY_DURATION)
      : 1;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#0078ff';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw weapon
    ctx.fillStyle = this.weapon === 0 ? '#ffaa00' : '#ff0000';
    const weaponX = this.flip ? this.x - 8 : this.x + this.width;
    ctx.fillRect(weaponX, this.y + 12, 8, 4);

    ctx.globalAlpha = 1;
  }
}