import { Transform } from '../components/Transform.js';
import { Collision } from '../components/Collision.js';
import { Platform } from '../components/Platform.js';
import { Physics } from '../components/Physics.js';

export class CollisionSystem {
  constructor(ecsManager, gameStore) {
    this.ecsManager = ecsManager;
    this.gameStore = gameStore;
    this.hoverHeight = 0.8; // Altura de flotación sobre plataformas
    this.platformDetectionRange = 1.5; // Rango para detectar plataformas
  }
  
  update() {
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
      
      // Filtrar obstáculos cercanos
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
          
          // Verificar si está cerca de una plataforma (flotación suave)
          if (distanceToTop >= -this.hoverHeight && distanceToTop <= this.platformDetectionRange) {
            const platformDistance = Math.abs(distanceToTop);
            if (platformDistance < nearestPlatformDistance) {
              onPlatform = true;
              platformHeight = obstacleBox.maxY;
              nearestPlatformDistance = platformDistance;
            }
          }
          
          // Verificar colisión frontal/lateral (más estricta)
          const intersects = this.checkFullIntersection(shipBox, obstacleBox);
          if (intersects && distanceToTop < -this.hoverHeight) {
            this.gameStore.handleCollision();
            return;
          }
        }
      }
      
      // Actualizar estado de plataforma con transición suave
      if (shipPlatform) {
        const wasOnPlatform = shipPlatform.isOnPlatform;
        shipPlatform.isOnPlatform = onPlatform;
        
        if (onPlatform) {
          const targetHeight = platformHeight + this.hoverHeight;
          const currentHeight = shipTransform.position[1];
          
          // Transición suave hacia la altura de flotación
          if (Math.abs(currentHeight - targetHeight) > 0.1) {
            const lerpFactor = wasOnPlatform ? 0.15 : 0.08; // Más rápido si ya estaba en plataforma
            shipTransform.position[1] = this.lerp(currentHeight, targetHeight, lerpFactor);
          } else {
            shipTransform.position[1] = targetHeight;
          }
          
          // Amortiguar velocidad vertical cuando está sobre plataforma
          if (shipPhysics && shipPhysics.velocity.y < 0) {
            shipPhysics.velocity.y *= 0.3;
          }
        } else if (wasOnPlatform && !onPlatform) {
          // Impulso adicional al salir de la plataforma
          if (shipPhysics && shipPhysics.velocity.y > 0) {
            shipPhysics.velocity.y *= 1.2; // Boost al saltar desde plataforma
          }
        }
      }
    });
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