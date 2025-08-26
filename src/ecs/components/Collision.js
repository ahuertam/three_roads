export class Collision {
  constructor(width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;
  }
  
  getBoundingBox(position) {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    const halfDepth = this.depth / 2;
    
    return {
      minX: position[0] - halfWidth,
      maxX: position[0] + halfWidth,
      minY: position[1] - halfHeight,
      maxY: position[1] + halfHeight,
      minZ: position[2] - halfDepth,
      maxZ: position[2] + halfDepth
    };
  }
}