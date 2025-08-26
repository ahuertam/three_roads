export class Transform {
  constructor(x = 0, y = 0, z = 0) {
    this.position = [x, y, z];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
  }
}