import { ECSManager } from './ECSManager.js';
import { InputSystem } from './systems/InputSystem.js';
import { MovementSystem } from './systems/MovementSystem.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { ObstacleSpawnSystem } from './systems/ObstacleSpawnSystem.js';
import { ParticleSystem } from './systems/ParticleSystem.js';
import { EntityFactory } from './entities/EntityFactory.js';
import { audioSystem } from './systems/AudioSystem.js';

export class GameManager {
  constructor(gameStore) {
    this.ecsManager = new ECSManager();
    this.gameStore = gameStore;
    this.shipEntity = null;
    this.isRunning = false;
    
    this.initializeSystems();
    this.initializeEntities();
    
    // Inicializar sistema de audio
    this.audioSystem = audioSystem;
  }
  
  initializeSystems() {
    // Crear sistema de partículas primero
    this.particleSystem = new ParticleSystem(this.ecsManager);
    
    // Orden importante: Input -> Movement -> Collision -> Particles -> Spawn
    this.inputSystem = new InputSystem(this.ecsManager);
    // En el constructor o método start, cuando se inicializa el MovementSystem:
    this.movementSystem = new MovementSystem(this.ecsManager, this.gameStore);
    this.collisionSystem = new CollisionSystem(this.ecsManager, this.gameStore, this.particleSystem);
    this.obstacleSpawnSystem = new ObstacleSpawnSystem(this.ecsManager, this.gameStore);
    
    this.ecsManager.addSystem(this.inputSystem);
    this.ecsManager.addSystem(this.movementSystem);
    this.ecsManager.addSystem(this.collisionSystem);
    this.ecsManager.addSystem(this.particleSystem);
    this.ecsManager.addSystem(this.obstacleSpawnSystem);
  }
  
  initializeEntities() {
    this.shipEntity = EntityFactory.createShip(this.ecsManager);
  }
  
  update(delta) {
    if (!this.isRunning) return;
    
    this.gameStore.updateGameTime(delta);
    this.ecsManager.update(delta);
    
    if (this.shipEntity) {
      const transform = this.shipEntity.getComponent('Transform');
      if (transform) {
        this.gameStore.setShipPosition(transform.position);
      }
    }
  }
  
  start() {
    this.isRunning = true;
  }
  
  stop() {
    this.isRunning = false;
  }
  
  restart() {
    this.ecsManager.entities.clear();
    this.ecsManager.components.clear();
    
    this.initializeEntities();
    this.start();
  }
  
  getShipEntity() {
    return this.shipEntity;
  }
  
  getObstacleEntities() {
    return this.ecsManager.getEntitiesWithTag('obstacle');
  }
  
  getParticleEntities() {
    return this.ecsManager.getEntitiesWithTag('particle');
  }
  
  destroy() {
    this.inputSystem.destroy();
    this.stop();
  }
  
  // Método para controlar el volumen desde la UI si es necesario
  setAudioVolume(volume) {
    this.audioSystem.setMasterVolume(volume);
  }
  
  toggleAudio() {
    return this.audioSystem.toggleSound();
  }
}