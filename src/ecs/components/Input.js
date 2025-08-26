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
    this.accelerationSpeed = 15;
    this.jumpForce = 12;
  }
}