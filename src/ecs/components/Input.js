export class Input {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      forward: false,
      backward: false,
      jump: false
    };
    this.lateralSpeed = 12;
    this.accelerationSpeed = 25; // Aumentado de 15 a 25
    this.jumpForce = 12;
  }
}