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
    const physicsEntities = this.ecsManager.getEntitiesWithComponents([Transform, Physics]);

    if (this.lastLevelIndex !== levelIndex) {
      console.log('MovementSystem: Level change detected!', this.lastLevelIndex, '->', levelIndex);
      console.log('Resetting ship to:', shipPosition);
      
      this.lastLevelIndex = levelIndex;
      
      physicsEntities.forEach(entity => {
        const transform = entity.getComponent(Transform);
        const physics = entity.getComponent(Physics);
        
        // Resetear posición y física COMPLETAMENTE
        transform.position = [...shipPosition];
        physics.velocity = { x: 0, y: 0, z: 0 };
        physics.isGrounded = false;
        
        // CRÍTICO: Resetear estado de rebote para evitar caídas
        physics.bounceVelocity = 0;
        physics.bounceCount = 0;
        
        console.log('Entity reset to:', transform.position);
        
        // Resetear plataforma
        const platform = entity.getComponent(Platform);
        if (platform) {
          platform.setOffPlatform();
        }
        
        // RESETEAR SUMINISTROS AL 100%
        const platformEffect = entity.getComponent(PlatformEffect);
        if (platformEffect) {
          platformEffect.supplies = 100;
          platformEffect.currentEffect = 'none';
          platformEffect.effectTimer = 0;
          console.log('Supplies reset to 100');
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
        
        // VERIFICAR SI SE QUEDÓ SIN SUMINISTROS
        if (platformEffect.supplies <= 0) {
          const currentState = this.gameStore.getState();
          
          // Solo explotar si estamos jugando (evitar bucles)
          if (currentState.gameState === 'playing') {
            console.log('Ship ran out of supplies!');
            
            // Crear explosión
            if (this.particleSystem) {
              this.particleSystem.createExplosion(transform.position, 30);
            }
            
            // Manejar crash por falta de suministros
            currentState.handleCollision(transform.position);
            
            // Detener la nave
            physics.velocity.x = 0;
            physics.velocity.y = 0;
            physics.velocity.z = 0;
            audioSystem.playSound('explosion', 1.0, 1.0);
          }
        }
      }
    });
  }
  
  handleInput(input, physics, platform, platformEffect, delta) {
    // Verificar si está bajo efecto slippery o sticky
    const isSlippery = platformEffect.isEffectActive('slippery');
    const isSticky = platformEffect.isEffectActive('sticky');
    
    // Slippery: control lateral muy reducido (40% de control)
    // Sticky: control lateral también reducido por la pegajosidad (60% de control)
    let lateralMultiplier = 1.0;
    if (isSlippery) {
      lateralMultiplier = 0.4; // Reducido de 0.7 a 0.4 para efecto mucho más notorio
    } else if (isSticky) {
      lateralMultiplier = 0.6; // Nuevo: sticky también reduce control lateral
    }
    
    // Movimiento lateral
    if (input.keys.left) {
      physics.velocity.x = -input.lateralSpeed * lateralMultiplier;
    } else if (input.keys.right) {
      physics.velocity.x = input.lateralSpeed * lateralMultiplier;
    } else {
      // Aplicar fricción según el tipo de plataforma
      let frictionRate = physics.friction;
      if (isSlippery) {
        frictionRate = 0.995; // Casi sin fricción - deslizamiento extremo
      } else if (isSticky) {
        frictionRate = 0.3; // Fricción muy alta - detiene casi instantáneamente
      }
      physics.velocity.x *= frictionRate;
    }
    
    // Movimiento hacia adelante con consumo de suministros escalado por velocidad
    if (input.keys.forward) {
      // Solo acelerar si hay suministros
      if (platformEffect.supplies > 0) {
        this.baseSpeed = Math.min(this.baseSpeed + input.accelerationSpeed * delta, 200);
        
        // Consumir suministros al acelerar - AUMENTA con la velocidad
        // A baja velocidad: consumo bajo, a alta velocidad: consumo alto
        const speedFactor = this.baseSpeed / 200; // 0 a 1
        const baseConsumption = 1.5;
        const speedMultiplier = 1 + (speedFactor * 3); // 1x a 4x consumo
        const accelerationConsumption = baseConsumption * speedMultiplier;
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
    
    // Logic removed: Misplaced bounce code that triggered in mid-air
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
      const floatHeight = 0.8; // Altura de flotación reducida para mejor contacto visual
      const targetY = platform.platformHeight + floatHeight;
      
      // Ajustar suavemente la posición Y para flotar
      if (transform.position[1] < targetY) {
        transform.position[1] = Math.min(targetY, transform.position[1] + 15 * delta);
      }
      
      // Estabilizar la nave cuando está flotando
      if (Math.abs(transform.position[1] - targetY) < 0.2) {
        physics.velocity.y = Math.max(0, physics.velocity.y * 0.8);
        physics.bounceCount = 0; // Reset bounce count when stable
      }
      
      // EFECTO REBOTE cuando la nave aterriza en la plataforma desde arriba
      if (physics.velocity.y < -2.0 && transform.position[1] <= targetY + 0.5) {
        const impactVelocity = Math.abs(physics.velocity.y);
        physics.bounceVelocity = impactVelocity * 0.4; // Rebote suave en plataformas
        physics.bounceCount++;
        physics.velocity.y = 0;
        
        // Sonido de aterrizaje suave - CORREGIDO
        audioSystem.playBounceSound(0.3, physics.bounceCount);
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
        audioSystem.playSound('explosion', 1.0, 1.0);
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