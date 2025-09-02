import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Input } from '../components/Input.js';
import { Platform } from '../components/Platform.js';
import { PlatformEffect } from '../components/PlatformEffect.js';
import { audioSystem } from './AudioSystem.js';

export class MovementSystem {
  constructor(ecsManager, gameStore) {
    this.ecsManager = ecsManager;
    this.gameStore = gameStore;
    this.baseSpeed = 5;
    this.groundHoverHeight = 0.6; // Altura de flotación sobre el suelo
  }
  
  update(delta) {
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
      this.updatePosition(transform, physics, delta);
      
      // Actualizar el game store con los suministros
      if (this.gameStore) {
        this.gameStore.setSupplies(platformEffect.getSuppliesPercentage());
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
        this.baseSpeed = Math.min(this.baseSpeed + input.accelerationSpeed * delta, 30); // Aumentado de 20 a 30
        
        // Consumir suministros al acelerar - CONSUMO MÍNIMO
        const accelerationConsumption = 1.5; // Reducido de 2 a 1.5
        platformEffect.supplies = Math.max(0, platformEffect.supplies - accelerationConsumption * delta);
      } else {
        // Sin suministros, velocidad se reduce gradualmente
        this.baseSpeed = Math.max(this.baseSpeed * 0.95, 3);
      }
    } else if (input.keys.backward) {
      this.baseSpeed = Math.max(this.baseSpeed - input.accelerationSpeed * delta, 2);
    } else {
      this.baseSpeed = Math.max(this.baseSpeed * 0.99, 6); // Velocidad base aumentada de 5 a 6
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
  
  updatePosition(transform, physics, delta) {
    transform.position[0] += physics.velocity.x * delta;
    transform.position[1] += physics.velocity.y * delta;
    transform.position[2] += physics.velocity.z * delta;
    
    // Limitar movimiento lateral
    transform.position[0] = Math.max(-40, Math.min(40, transform.position[0]));
    
    // Colisión con el suelo mejorada - REBOTE MÁS NOTORIO
    const groundLevel = this.groundHoverHeight;
    if (transform.position[1] <= groundLevel) {
      transform.position[1] = groundLevel;
      
      // Rebote mejorado - más intenso y notorio
      if (physics.velocity.y < -1.2 && physics.bounceCount < physics.maxBounces) { // Reducido umbral de -1.5 a -1.2
        // Rebote más intenso basado en la velocidad de impacto
        const impactVelocity = Math.abs(physics.velocity.y);
        physics.bounceVelocity = impactVelocity * physics.bounceIntensity;
        physics.bounceCount++;
        
        // Limitar rebote máximo pero permitir rebotes más altos
        physics.bounceVelocity = Math.min(physics.bounceVelocity, 15); // Aumentado de 12 a 15
        
        // Añadir un pequeño impulso adicional para hacer el rebote más notorio
        if (physics.bounceCount === 1) {
          physics.bounceVelocity *= 1.3; // Aumentado de 1.2 a 1.3
        }
        
        // REPRODUCIR SONIDO DE REBOTE
        const bounceIntensity = Math.min(1.0, impactVelocity / 15);
        audioSystem.playBounceSound(bounceIntensity, physics.bounceCount);
      }
      
      physics.velocity.y = 0;
      physics.isGrounded = true;
      
      // Resetear contador de rebotes de forma más gradual
      if (physics.isGrounded && Math.abs(physics.velocity.y) < 0.1 && physics.bounceVelocity < 0.3) { // Umbrales más bajos
        physics.bounceCount = 0;
        physics.bounceVelocity = 0;
      }
    } else {
      physics.isGrounded = false;
    }
  }
}