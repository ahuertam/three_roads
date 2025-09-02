export class Input {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      forward: false,
      backward: false,
      jump: false
    };
    this.lateralSpeed = 15; // Aumentado de 12 a 15
    this.accelerationSpeed = 35; // Aumentado de 25 a 35
    this.jumpForce = 44;
  }
}