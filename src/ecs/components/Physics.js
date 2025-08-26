export class Physics {
  constructor() {
    this.velocity = { x: 0, y: 0, z: 0 };
    this.acceleration = { x: 0, y: 0, z: 0 };
    this.mass = 1;
    this.friction = 0.85;
    this.gravity = -22; // Gravedad ligeramente reducida para mejor sensación
    this.isGrounded = false;
    this.bounceVelocity = 0;
    this.bounceCount = 0;
    this.maxBounces = 3; // Más rebotes permitidos
    this.airResistance = 0.98; // Nueva propiedad para resistencia del aire
  }
}