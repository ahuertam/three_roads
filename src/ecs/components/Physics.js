export class Physics {
  constructor() {
    this.velocity = { x: 0, y: 0, z: 0 };
    this.acceleration = { x: 0, y: 0, z: 0 };
    this.mass = 1;
    this.friction = 0.85;
    this.gravity = -32;
    this.isGrounded = false;
    this.bounceVelocity = 0;
    this.bounceCount = 0;
    this.maxBounces = 5; // Aumentado de 4 a 5
    this.airResistance = 0.98; // Aumentado de 0.96 a 0.98 para menos pérdida
    this.bounceIntensity = 0.55; // Aumentado de 0.45 a 0.55
  }
}