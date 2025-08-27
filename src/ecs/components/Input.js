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
    this.accelerationSpeed = 25;
    this.jumpForce = 18; // Aumentado de 12 a 18 para saltos más altos
  }
}