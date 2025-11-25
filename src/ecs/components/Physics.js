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
    this.maxBounces = 6; // Aumentado de 5 a 6
    this.airResistance = 0.98; // Aumentado de 0.96 a 0.98 para menos pérdida
    this.bounceIntensity = 0.8; // Aumentado de 0.55 a 0.8 para rebote más visible
  }
}