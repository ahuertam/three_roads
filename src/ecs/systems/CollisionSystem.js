import { Transform } from '../components/Transform.js';
import { Collision } from '../components/Collision.js';
import { Platform } from '../components/Platform.js';
import { Physics } from '../components/Physics.js';
import useGameStore from '../../store/gameStore.js';

export class CollisionSystem {
  constructor(ecsManager, gameStore, particleSystem = null) {
    this.ecsManager = ecsManager;
    this.particleSystem = particleSystem;
    this.hoverHeight = 0.8;
    this.platformDetectionRange = 1.5;
  }
  
  update() {
    // Obtener el estado actual del store directamente
    const { gameState } = useGameStore.getState();
    
    // Solo procesar colisiones si el juego está en estado 'playing'
    if (gameState !== 'playing') return;
    
    const shipEntities = this.ecsManager.getEntitiesWithTag('player');
    const obstacleEntities = this.ecsManager.getEntitiesWithTag('obstacle');
    
    shipEntities.forEach(ship => {
      const shipTransform = ship.getComponent(Transform);
      const shipCollision = ship.getComponent(Collision);
      const shipPlatform = ship.getComponent(Platform);
      const shipPhysics = ship.getComponent(Physics);
      
      let onPlatform = false;
      let platformHeight = 0;
      let nearestPlatformDistance = Infinity;
      
      const nearbyObstacles = obstacleEntities.filter(obstacle => {
        const obstacleTransform = obstacle.getComponent(Transform);
        return Math.abs(obstacleTransform.position[2] - shipTransform.position[2]) < 12;
      });
      
      for (const obstacle of nearbyObstacles) {
        const obstacleTransform = obstacle.getComponent(Transform);
        const obstacleCollision = obstacle.getComponent(Collision);
        
        const shipBox = shipCollision.getBoundingBox(shipTransform.position);
        const obstacleBox = obstacleCollision.getBoundingBox(obstacleTransform.position);
        
        const isHorizontallyOver = this.checkHorizontalOverlap(shipBox, obstacleBox);
        
        if (isHorizontallyOver) {
          const distanceToTop = shipTransform.position[1] - obstacleBox.maxY;
          
          if (distanceToTop >= -this.hoverHeight && distanceToTop <= this.platformDetectionRange) {
            const platformDistance = Math.abs(distanceToTop);
            if (platformDistance < nearestPlatformDistance) {
              onPlatform = true;
              platformHeight = obstacleBox.maxY;
              nearestPlatformDistance = platformDistance;
            }
          }
          
          // Verificar colisión frontal/lateral
          const intersects = this.checkFullIntersection(shipBox, obstacleBox);
          if (intersects && distanceToTop < -this.hoverHeight) {
            this.handleCrash(shipTransform.position);
            return;
          }
        }
        
        // Verificar colisión lateral específica
        if (this.checkLateralCollision(shipBox, obstacleBox)) {
          this.handleCrash(shipTransform.position);
          return;
        }
      }
      
      // Actualizar estado de plataforma
      if (shipPlatform) {
        const wasOnPlatform = shipPlatform.isOnPlatform;
        shipPlatform.isOnPlatform = onPlatform;
        
        if (onPlatform) {
          const targetHeight = platformHeight + this.hoverHeight;
          const currentHeight = shipTransform.position[1];
          
          if (Math.abs(currentHeight - targetHeight) > 0.1) {
            const lerpFactor = wasOnPlatform ? 0.15 : 0.08;
            shipTransform.position[1] = this.lerp(currentHeight, targetHeight, lerpFactor);
          } else {
            shipTransform.position[1] = targetHeight;
          }
          
          if (shipPhysics && shipPhysics.velocity.y < 0) {
            shipPhysics.velocity.y *= 0.3;
          }
        } else if (wasOnPlatform && !onPlatform) {
          if (shipPhysics && shipPhysics.velocity.y > 0) {
            shipPhysics.velocity.y *= 1.2;
          }
        }
      }
    });
  }
  
  handleCrash(position) {
    // Crear explosión de partículas
    if (this.particleSystem) {
      this.particleSystem.createExplosion(position, 30);
    }
    
    // Obtener el estado y acciones del store directamente
    const { handleCollision } = useGameStore.getState();
    
    // Manejar colisión en el store
    handleCollision(position);
  }
  
  checkLateralCollision(shipBox, obstacleBox) {
    const lateralOverlap = !(shipBox.maxX < obstacleBox.minX || shipBox.minX > obstacleBox.maxX);
    const verticalOverlap = !(shipBox.maxY < obstacleBox.minY || shipBox.minY > obstacleBox.maxY);
    const depthOverlap = !(shipBox.maxZ < obstacleBox.minZ || shipBox.minZ > obstacleBox.maxZ);
    
    return lateralOverlap && verticalOverlap && depthOverlap;
  }
  
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }
  
  checkHorizontalOverlap(box1, box2) {
    return !(box1.maxX < box2.minX || box1.minX > box2.maxX || 
             box1.maxZ < box2.minZ || box1.minZ > box2.maxZ);
  }
  
  checkFullIntersection(box1, box2) {
    return !(box1.maxX < box2.minX || box1.minX > box2.maxX ||
             box1.maxY < box2.minY || box1.minY > box2.maxY ||
             box1.maxZ < box2.minZ || box1.minZ > box2.maxZ);
  }
}