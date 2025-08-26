import { ECSManager } from './ECSManager.js';
import { InputSystem } from './systems/InputSystem.js';
import { MovementSystem } from './systems/MovementSystem.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { ObstacleSpawnSystem } from './systems/ObstacleSpawnSystem.js';
import { EntityFactory } from './entities/EntityFactory.js';

export class GameManager {
  constructor(gameStore) {
    this.ecsManager = new ECSManager();
    this.gameStore = gameStore;
    this.shipEntity = null;
    this.isRunning = false;
    
    this.initializeSystems();
    this.initializeEntities();
  }
  
  initializeSystems() {
    // Orden importante: Input -> Movement -> Collision -> Spawn
    this.inputSystem = new InputSystem(this.ecsManager);
    this.movementSystem = new MovementSystem(this.ecsManager);
    this.collisionSystem = new CollisionSystem(this.ecsManager, this.gameStore);
    this.obstacleSpawnSystem = new ObstacleSpawnSystem(this.ecsManager, this.gameStore);
    
    this.ecsManager.addSystem(this.inputSystem);
    this.ecsManager.addSystem(this.movementSystem);
    this.ecsManager.addSystem(this.collisionSystem);
    this.ecsManager.addSystem(this.obstacleSpawnSystem);
  }
  
  initializeEntities() {
    this.shipEntity = EntityFactory.createShip(this.ecsManager);
  }
  
  update(delta) {
    if (!this.isRunning) return;
    
    this.gameStore.updateGameTime(delta);
    this.ecsManager.update(delta);
    
    // Sincronizar posición de la nave con el store
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
    // Limpiar todas las entidades
    this.ecsManager.entities.clear();
    this.ecsManager.components.clear();
    
    // Recrear entidades
    this.initializeEntities();
    this.start();
  }
  
  getShipEntity() {
    return this.shipEntity;
  }
  
  getObstacleEntities() {
    return this.ecsManager.getEntitiesWithTag('obstacle');
  }
  
  destroy() {
    this.inputSystem.destroy();
    this.stop();
  }
}