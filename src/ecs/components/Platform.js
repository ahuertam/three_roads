export class Platform {
  constructor() {
    this.isOnPlatform = false;
    this.platformHeight = 0;
    this.lastPlatformTime = 0;
    this.platformTransitionSpeed = 0.15; // Velocidad de transición
    this.jumpBoostMultiplier = 1.3; // Multiplicador de salto desde plataforma
  }
  
  setOnPlatform(height) {
    this.isOnPlatform = true;
    this.platformHeight = height;
    this.lastPlatformTime = Date.now();
  }
  
  setOffPlatform() {
    this.isOnPlatform = false;
    this.platformHeight = 0;
  }
  
  getTimeSinceLastPlatform() {
    return Date.now() - this.lastPlatformTime;
  }
}