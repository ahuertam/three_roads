import { Transform } from '../components/Transform.js';
import { Collision } from '../components/Collision.js';
import { Platform } from '../components/Platform.js';
import { Physics } from '../components/Physics.js';
import { PlatformEffect } from '../components/PlatformEffect.js';
import useGameStore from '../../store/gameStore.js';

export class CollisionSystem {
  constructor(ecsManager, gameStore, particleSystem = null) {
    this.ecsManager = ecsManager;
    this.gameStore = gameStore;
    this.particleSystem = particleSystem;
    this.hoverHeight = 0.8;
    this.platformDetectionRange = 2.0; // Aumentado de 1.5 a 2.0
  }
  
  update() {
    const { gameState } = useGameStore.getState();
    
    if (gameState !== 'playing') return;
    
    const shipEntities = this.ecsManager.getEntitiesWithTag('player');
    const obstacleEntities = this.ecsManager.getEntitiesWithTag('obstacle');
    
    shipEntities.forEach(ship => {
      const shipTransform = ship.getComponent(Transform);
      const shipCollision = ship.getComponent(Collision);
      const shipPlatform = ship.getComponent(Platform);
      const shipPhysics = ship.getComponent(Physics);
      
      // Agregar componente de efectos si no existe
      let shipEffects = ship.getComponent(PlatformEffect);
      if (!shipEffects) {
        shipEffects = new PlatformEffect();
        ship.addComponent(shipEffects);
      }
      
      let onPlatform = false;
      let platformHeight = 0;
      let nearestPlatformDistance = Infinity;
      
      // MEJORAR FILTRO DE OBSTÁCULOS CERCANOS
      const nearbyObstacles = obstacleEntities.filter(obstacle => {
        const obstacleTransform = obstacle.getComponent(Transform);
        const distance = Math.abs(obstacleTransform.position[2] - shipTransform.position[2]);
        return distance < 8; // Reducir rango para mejor rendimiento
      });
      
      for (const obstacle of nearbyObstacles) {
        const obstacleTransform = obstacle.getComponent(Transform);
        const obstacleCollision = obstacle.getComponent(Collision);
        
        const shipBox = shipCollision.getBoundingBox(shipTransform.position);
        const obstacleBox = obstacleCollision.getBoundingBox(obstacleTransform.position);
        
        // MEJORAR DETECCIÓN DE COLISIÓN VERTICAL
        const isHorizontallyOver = this.checkHorizontalOverlap(shipBox, obstacleBox);
        
        if (isHorizontallyOver) {
          const distanceToTop = shipTransform.position[1] - obstacleBox.maxY;
          const distanceToBottom = obstacleBox.minY - shipTransform.position[1];
          
          // DETECCIÓN MEJORADA DE PLATAFORMA
          if (distanceToTop >= -1.0 && distanceToTop <= this.platformDetectionRange) { // Cambiado de -0.5 a -1.0
            // Verificar que la nave esté cayendo o cerca de la superficie
            if (shipPhysics.velocity.y <= 1.0 || distanceToTop <= 0.5) { // Más permisivo
              if (distanceToTop < nearestPlatformDistance) {
                nearestPlatformDistance = distanceToTop;
                platformHeight = obstacleBox.maxY;
                onPlatform = true;
                
                // Aplicar efecto de plataforma con rango más amplio
                if (obstacle.platformType && distanceToTop <= 0.5) { // Cambiado de 0.2 a 0.5
                  this.applyPlatformEffect(shipEffects, shipPhysics, obstacle.platformType);
                  this.gameStore.setSupplies(shipEffects.getSuppliesPercentage());
                  this.gameStore.setCurrentEffect(shipEffects.currentEffect);
                }
              }
            }
          }
          
          // COLISIÓN SÓLIDA MEJORADA - evitar atravesar plataformas
          if (this.checkSolidCollisionImproved(shipTransform, shipPhysics, obstacleBox)) {
            if (obstacle.platformType === 'BURNING') {
              this.handleBurningDamage(ship);
            } else {
              this.handleCollision(ship, obstacleTransform.position);
            }
            return;
          }
        }
      }
      
      // Actualizar efectos
      shipEffects.update(1/60); // Asumiendo 60 FPS
      
      // Aplicar efectos activos a la física
      this.applyActiveEffects(shipPhysics, shipEffects);
      
      // Update game store with current effects
      this.gameStore.setSupplies(shipEffects.getSuppliesPercentage());
      this.gameStore.setCurrentEffect(shipEffects.currentEffect);
      
      if (onPlatform) {
        shipPlatform.setOnPlatform(platformHeight);
      } else {
        shipPlatform.setOffPlatform();
      }
    });
  }
  
  applyPlatformEffect(shipEffects, shipPhysics, platformType) {
    switch(platformType) {
      case 'BOOST':
        shipEffects.applyEffect('boost');
        break;
      case 'STICKY':
        shipEffects.applyEffect('sticky');
        break;
      case 'SLIPPERY':
        shipEffects.applyEffect('slippery');
        break;
      case 'BURNING':
        shipEffects.applyEffect('burning');
        break;
      case 'SUPPLIES':
        shipEffects.applyEffect('supplies');
        break;
    }
  }
  
  applyActiveEffects(shipPhysics, shipEffects) {
    // Boost: aumenta velocidad
    if (shipEffects.isEffectActive('boost')) {
      shipPhysics.velocity.z *= 1.5;
    }
    
    // Sticky: reduce velocidad lateral
    if (shipEffects.isEffectActive('sticky')) {
      shipPhysics.velocity.x *= 0.5;
    }
    
    // Slippery: reduce fricción y mejora el deslizamiento
    if (shipEffects.isEffectActive('slippery')) {
      shipPhysics.friction = 0.98; // Cambiado de 0.95 a 0.98 para mejor control
      // Reducir velocidad lateral gradualmente para evitar colisiones bruscas
      if (Math.abs(shipPhysics.velocity.x) > 8) {
        shipPhysics.velocity.x *= 0.95;
      }
    } else {
      shipPhysics.friction = 0.85; // Valor normal
    }
    
    // Burning: daño continuo
    if (shipEffects.isEffectActive('burning')) {
      // El daño se maneja en handleBurningDamage
    }
  }
  
  handleBurningDamage(ship) {
    // Reducir suministros o vida
    const shipEffects = ship.getComponent(PlatformEffect);
    if (shipEffects.supplies > 0) {
      shipEffects.supplies = Math.max(0, shipEffects.supplies - 10);
    } else {
      // Si no hay suministros, causar daño real
      this.handleCollision(ship, ship.getComponent(Transform).position);
    }
  }
  
  handleCollision(ship, position) {
    this.handleCrash(position);
  }
  
  checkCollision(shipBox, obstacleBox) {
    return this.checkLateralCollision(shipBox, obstacleBox);
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
  
  checkSolidCollisionImproved(shipTransform, shipPhysics, obstacleBox) {
    const shipY = shipTransform.position[1];
    const shipX = shipTransform.position[0];
    const shipZ = shipTransform.position[2];
    
    // NUNCA colisionar desde arriba - permitir siempre aterrizar
    if (shipY > obstacleBox.maxY - 1.0) {
      return false; // La nave está por encima del obstáculo
    }
    
    // NUEVA DETECCIÓN: Líneas laterales horizontales en la mitad del obstáculo
    const obstacleMiddleY = (obstacleBox.minY + obstacleBox.maxY) / 2;
    const obstacleHeight = obstacleBox.maxY - obstacleBox.minY;
    const lateralDetectionZone = obstacleHeight * 0.3; // 30% de la altura del obstáculo
    
    // Verificar si la nave está en la zona de detección lateral (mitad del obstáculo)
    const isInLateralZone = shipY >= (obstacleMiddleY - lateralDetectionZone) && 
                           shipY <= (obstacleMiddleY + lateralDetectionZone);
    
    if (isInLateralZone) {
      // Verificar si la nave está en el rango Z del obstáculo
      const isInObstacleZ = shipZ >= obstacleBox.minZ - 0.5 && shipZ <= obstacleBox.maxZ + 0.5;
      
      if (isInObstacleZ) {
        // LÍNEA LATERAL IZQUIERDA - trazar línea horizontal en la mitad
        const leftBoundary = obstacleBox.minX;
        const isHittingLeftSide = shipX >= leftBoundary - 1.0 && shipX <= leftBoundary + 0.5;
        
        // LÍNEA LATERAL DERECHA - trazar línea horizontal en la mitad  
        const rightBoundary = obstacleBox.maxX;
        const isHittingRightSide = shipX >= rightBoundary - 0.5 && shipX <= rightBoundary + 1.0;
        
        // Colisión si cruza cualquiera de las líneas laterales
        if (isHittingLeftSide || isHittingRightSide) {
          return true;
        }
      }
    }
    
    // COLISIÓN FRONTAL CORREGIDA - cuando la nave está DENTRO del obstáculo
    const isInsideObstacleZ = shipZ >= obstacleBox.minZ && shipZ <= obstacleBox.maxZ;
    const isInObstacleX = shipX >= obstacleBox.minX - 0.3 && shipX <= obstacleBox.maxX + 0.3;
    const isInObstacleY = shipY >= obstacleBox.minY && shipY <= obstacleBox.maxY - 0.5;
    
    if (isInsideObstacleZ && isInObstacleX && isInObstacleY) {
      return true; // Colisión frontal - la nave está dentro del obstáculo
    }
    
    return false; // No hay colisión
  }
}