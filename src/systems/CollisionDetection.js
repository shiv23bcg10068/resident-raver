export class CollisionDetection {
  static checkAABB(entity1, entity2) {
    return (
      entity1.x < entity2.x + (entity2.width || entity2.radius * 2) &&
      entity1.x + (entity1.width || entity1.radius * 2) > entity2.x &&
      entity1.y < entity2.y + (entity1.height || entity1.radius * 2) &&
      entity1.y + (entity1.height || entity1.radius * 2) > entity2.y
    );
  }

  static checkCircleAABB(circle, box) {
    const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width));
    const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height));

    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    return (distanceX * distanceX + distanceY * distanceY) < (circle.radius * circle.radius);
  }
}