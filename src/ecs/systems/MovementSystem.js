import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Input } from '../components/Input.js';
import { Platform } from '../components/Platform.js';
import { PlatformEffect } from '../components/PlatformEffect.js';
import { audioSystem } from './AudioSystem.js';

export class MovementSystem {
  constructor(ecsManager, gameStore, particleSystem = null) {
    this.ecsManager = ecsManager;
    this.gameStore = gameStore;
    this.particleSystem = particleSystem;
    this.baseSpeed = 0; // Velocidad inicial 0
    this.groundHoverHeight = 0.6; // Altura de flotación sobre el suelo
    this.lastLevelIndex = 0;
  }
  
  update(delta) {
    const { levelIndex, shipPosition } = this.gameStore.getState();
    
    // Detectar cambio de nivel y resetear física
    // O si la posición está desincronizada (failsafe)
    let forceReset = false;
    const physicsEntities = this.ecsManager.getEntitiesWithComponents([Transform, Physics]);
    
    if (physicsEntities.length > 0) {
      const shipZ = physicsEntities[0].getComponent(Transform).position[2];
      if (Math.abs(shipZ - shipPosition[2]) > 500) {
        console.log('MovementSystem: Position desync detected! Force reset.');
        forceReset = true;
      }
    }

    if (this.lastLevelIndex !== levelIndex || forceReset) {
      console.log('MovementSystem: Level change/Reset detected!', this.lastLevelIndex, '->', levelIndex);
      console.log('Resetting ship to:', shipPosition);
      
      this.lastLevelIndex = levelIndex;
      
      physicsEntities.forEach(entity => {
        const transform = entity.getComponent(Transform);
        const physics = entity.getComponent(Physics);
        
        // Resetear posición y física
        transform.position = [...shipPosition];
        physics.velocity = { x: 0, y: 0, z: 0 };
        physics.isGrounded = false;
        
        console.log('Entity reset to:', transform.position);
        
        // Resetear plataforma
        const platform = entity.getComponent(Platform);
        if (platform) {
          platform.setOffPlatform();
        }
      });
      return; // Saltar este frame para evitar movimientos erráticos
    }

    const entities = this.ecsManager.getEntitiesWithComponents([Transform, Physics, Input]);
    
    entities.forEach(entity => {
      const transform = entity.getComponent(Transform);
      const physics = entity.getComponent(Physics);
      const input = entity.getComponent(Input);
      const platform = entity.getComponent(Platform);
      
      // Obtener o crear componente de efectos
      let platformEffect = entity.getComponent(PlatformEffect);
      if (!platformEffect) {
        platformEffect = new PlatformEffect();
        entity.addComponent(platformEffect);
      }
      
      this.handleInput(input, physics, platform, platformEffect, delta);
      this.applyPhysics(transform, physics, platform, delta);
      this.updatePosition(transform, physics, platform, delta); // Agregar parámetro platform
      
      // Actualizar el game store con los suministros
      if (this.gameStore) {
        this.gameStore.getState().setSupplies(platformEffect.getSuppliesPercentage());
      }
    });
  }
  
  handleInput(input, physics, platform, platformEffect, delta) {
    // Verificar si está bajo efecto slippery
    const isSlippery = platformEffect.isEffectActive('slippery');
    const lateralMultiplier = isSlippery ? 0.7 : 1.0; // Reducir control lateral cuando es slippery
    
    // Movimiento lateral
    if (input.keys.left) {
      physics.velocity.x = -input.lateralSpeed * lateralMultiplier;
    } else if (input.keys.right) {
      physics.velocity.x = input.lateralSpeed * lateralMultiplier;
    } else {
      // Aplicar fricción más gradual cuando es slippery
      const frictionRate = isSlippery ? 0.98 : physics.friction;
      physics.velocity.x *= frictionRate;
    }
    
    // Movimiento hacia adelante con consumo de suministros MUY REDUCIDO
    if (input.keys.forward) {
      // Solo acelerar si hay suministros
      if (platformEffect.supplies > 0) {
        this.baseSpeed = Math.min(this.baseSpeed + input.accelerationSpeed * delta, 200); // Aumentado de 30 a 60
        
        // Consumir suministros al acelerar - CONSUMO MÍNIMO
        const accelerationConsumption = 1.5; // Reducido de 2 a 1.5
        platformEffect.supplies = Math.max(0, platformEffect.supplies - accelerationConsumption * delta);
      } else {
        // Sin suministros, velocidad se reduce gradualmente
        this.baseSpeed = Math.max(this.baseSpeed * 0.95, 3);
      }
    } else if (input.keys.backward) {
      this.baseSpeed = Math.max(this.baseSpeed - input.accelerationSpeed * delta, 0); // Permitir frenar hasta 0
    } else {
      // Deceleración natural si no se pulsa nada
      if (this.baseSpeed > 0) {
        this.baseSpeed = Math.max(this.baseSpeed * 0.95, 0);
        // Si es muy baja, detener completamente
        if (this.baseSpeed < 0.1) this.baseSpeed = 0;
      }
    }
    
    physics.velocity.z = -this.baseSpeed;
    // En el método handleInput, donde está el salto:
    if (input.keys.jump && (physics.isGrounded || platform?.isOnPlatform)) {
      let jumpMultiplier = 1;
      
      if (platform?.isOnPlatform) {
        jumpMultiplier = 1.3;
        platform.isOnPlatform = false;
        physics.velocity.z *= 1.1;
      }
      
      physics.velocity.y = input.jumpForce * jumpMultiplier;
      physics.isGrounded = false;
      input.keys.jump = false;
      
      // REPRODUCIR SONIDO DE SALTO
      console.log('Intentando reproducir sonido de salto');
      audioSystem.playJumpSound(jumpMultiplier);
    }
    
    // En el método updatePosition, donde está el rebote:
    if (physics.velocity.y < -1.5 && physics.bounceCount < physics.maxBounces) {
      const impactVelocity = Math.abs(physics.velocity.y);
      physics.bounceVelocity = impactVelocity * physics.bounceIntensity;
      physics.bounceCount++;
      
      physics.bounceVelocity = Math.min(physics.bounceVelocity, 12);
      
      if (physics.bounceCount === 1) {
        physics.bounceVelocity *= 1.2;
      }
      
      // REPRODUCIR SONIDO DE REBOTE
      console.log('Intentando reproducir sonido de rebote');
      const bounceIntensity = Math.min(1.0, impactVelocity / 15);
      audioSystem.playBounceSound(bounceIntensity, physics.bounceCount);
    }
  }
  
  applyPhysics(transform, physics, platform, delta) {
    // Gravedad mejorada para caída más rápida
    if (!platform?.isOnPlatform) {
      let gravityMultiplier = 1;
      
      // Gravedad más intensa cuando está cayendo
      if (physics.velocity.y < 0) {
        gravityMultiplier = 1.5; // Caída más rápida
      } else if (physics.velocity.y > 0 && physics.velocity.y < 5) {
        gravityMultiplier = 0.9; // Subida ligeramente más suave
      }
      
      physics.velocity.y += physics.gravity * gravityMultiplier * delta;
      
      // Aplicar resistencia del aire
      physics.velocity.y *= physics.airResistance;
    } else {
      // Estabilizar velocidad vertical cuando está en plataforma
      if (physics.velocity.y < 0) {
        physics.velocity.y *= 0.1;
      }
    }
    
    // Efecto rebote mejorado y más notorio
    if (physics.bounceVelocity > 0 && physics.bounceCount < physics.maxBounces) {
      physics.velocity.y += physics.bounceVelocity;
      physics.bounceVelocity *= 0.8; // Cambiado de 0.7 a 0.8 para rebotes más duraderos
      if (physics.bounceVelocity < 0.8) { // Reducido de 1.2 a 0.8 para mantener rebotes más tiempo
        physics.bounceVelocity = 0;
      }
    }
  }
  
  updatePosition(transform, physics, platform, delta) {
    transform.position[0] += physics.velocity.x * delta;
    transform.position[1] += physics.velocity.y * delta;
    transform.position[2] += physics.velocity.z * delta;
    
    // Limitar movimiento lateral
    transform.position[0] = Math.max(-40, Math.min(40, transform.position[0]));
    
    // NUEVO: Hacer que la nave flote por encima de las plataformas
    if (platform?.isOnPlatform) {
      const floatHeight = 1.5; // Altura de flotación por encima de la plataforma
      const targetY = platform.platformHeight + floatHeight;
      
      // Ajustar suavemente la posición Y para flotar
      if (transform.position[1] < targetY) {
        transform.position[1] = Math.min(targetY, transform.position[1] + 15 * delta);
      }
      
      // Estabilizar la nave cuando está flotando
      if (Math.abs(transform.position[1] - targetY) < 0.2) {
        physics.velocity.y = Math.max(0, physics.velocity.y * 0.8);
      }
      
      // EFECTO REBOTE cuando la nave aterriza en la plataforma desde arriba
      if (physics.velocity.y < -2.0 && transform.position[1] <= targetY + 0.5) {
        const impactVelocity = Math.abs(physics.velocity.y);
        physics.bounceVelocity = impactVelocity * 0.4; // Rebote suave en plataformas
        physics.bounceCount = 1;
        physics.velocity.y = 0;
        
        // Sonido de aterrizaje suave - CORREGIDO
        audioSystem.playBounceSound(0.3, 1);
      }
    }
    
    // Colisión con el suelo ELIMINADA para permitir caer al vacío (SkyRoads style)
    // En su lugar, verificamos si ha caído demasiado para reiniciar/morir
    const deathThreshold = -30;
    if (transform.position[1] <= deathThreshold) {
      // Notificar al GameStore que el jugador ha muerto
      const currentState = this.gameStore.getState();
      
      // Solo actualizar si no estamos ya en gameover para evitar bucles
      if (currentState.gameState === 'playing') {
        console.log('Player fell into void');
        
        // Crear explosión si el sistema de partículas está disponible
        if (this.particleSystem) {
          this.particleSystem.createExplosion(transform.position, 30);
        }
        
        // Usar handleCollision para manejar la muerte consistentemente (vidas, crash screen)
        currentState.handleCollision(transform.position);
        
        // Detener la nave para que no siga cayendo infinitamente
        physics.velocity.x = 0;
        physics.velocity.y = 0;
        physics.velocity.z = 0;
        // Opcional: Reproducir sonido de caída/muerte
      }
    }
    
    // Si el juego ha terminado, no aplicar más física ni movimiento
    const currentState = this.gameStore.getState();
    if (currentState.gameState !== 'playing') {
      physics.velocity.x = 0;
      physics.velocity.y = 0;
      physics.velocity.z = 0;
      return;
    }
    
    // Ya no hay "suelo" infinito, solo plataformas
    // physics.isGrounded se maneja via CollisionSystem cuando toca una plataforma
    if (!platform?.isOnPlatform) {
      physics.isGrounded = false;
    }
  }
}