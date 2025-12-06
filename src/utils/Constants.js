export const CONSTANTS = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  GRAVITY: 0.5,
  PLAYER_SPEED: 5,
  JUMP_STRENGTH: 12,
  GROUND_Y: 300,
  ZOMBIE_SPEED: 1,
  BULLET_SPEED: 8,
  GRENADE_SPEED: 6,
  INVINCIBILITY_DURATION: 2,
  PLAYER_SIZE: { width: 20, height: 30 },
  ZOMBIE_SIZE: { width: 20, height: 30 },
  BULLET_SIZE: { width: 8, height: 4 },
  GRENADE_SIZE: { radius: 6 },
};

export const ENTITY_TYPES = {
  NONE: 0,
  FRIENDLY: 1,
  ENEMY: 2,
};

export const COLLISION_TYPES = {
  NEVER: 0,
  LITE: 1,
  PASSIVE: 2,
  ACTIVE: 3,
  FIXED: 4,
};