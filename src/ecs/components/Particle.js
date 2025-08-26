export class Particle {
  constructor(lifespan = 2.0, size = 0.1, color = '#ff4444') {
    this.lifespan = lifespan;
    this.maxLifespan = lifespan;
    this.size = size;
    this.initialSize = size;
    this.color = color;
    this.opacity = 1.0;
  }
  
  update(delta) {
    this.lifespan -= delta;
    
    // Fade out y reducir tamaño con el tiempo
    const lifeFactor = this.lifespan / this.maxLifespan;
    this.opacity = lifeFactor;
    this.size = this.initialSize * lifeFactor;
    
    return this.lifespan > 0;
  }
}