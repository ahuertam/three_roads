import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Input } from '../components/Input.js';
import { Platform } from '../components/Platform.js';
import { PlatformEffect } from '../components/PlatformEffect.js';
import useGameStore from '../../store/gameStore.js';

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
    // Movimiento lateral
    if (input.keys.left) {
      physics.velocity.x = -input.lateralSpeed;
    } else if (input.keys.right) {
      physics.velocity.x = input.lateralSpeed;
    } else {
      physics.velocity.x *= physics.friction;
    }
    
    // Movimiento hacia adelante con consumo de suministros MUY REDUCIDO
    if (input.keys.forward) {
      // Solo acelerar si hay suministros
      if (platformEffect.supplies > 0) {
        this.baseSpeed = Math.min(this.baseSpeed + input.accelerationSpeed * delta, 20);
        
        // Consumir suministros al acelerar - CONSUMO MÍNIMO
        const accelerationConsumption = 2; // Consumo fijo muy bajo de solo 2 por segundo
        platformEffect.supplies = Math.max(0, platformEffect.supplies - accelerationConsumption * delta);
      } else {
        // Sin suministros, velocidad se reduce gradualmente
        this.baseSpeed = Math.max(this.baseSpeed * 0.95, 3);
      }
    } else if (input.keys.backward) {
      this.baseSpeed = Math.max(this.baseSpeed - input.accelerationSpeed * delta, 2);
    } else {
      this.baseSpeed = Math.max(this.baseSpeed * 0.98, 5);
    }
    
    physics.velocity.z = -this.baseSpeed;
    
    // SALTO - Esta lógica faltaba
    // SALTO MEJORADO - Más dinámico
    if (input.keys.jump && (physics.isGrounded || platform?.isOnPlatform)) {
      let jumpMultiplier = 1;
      
      // Salto más potente desde plataformas
      if (platform?.isOnPlatform) {
        jumpMultiplier = 1.3;
        platform.isOnPlatform = false;
        // Pequeño impulso hacia adelante al saltar desde plataforma
        physics.velocity.z *= 1.1;
      }
      
      physics.velocity.y = input.jumpForce * jumpMultiplier;
      physics.isGrounded = false;
      input.keys.jump = false;
    }
  }
  
  applyPhysics(transform, physics, platform, delta) {
    // Gravedad variable según contexto
    if (!platform?.isOnPlatform) {
      let gravityMultiplier = 1;
      
      // Gravedad más suave cuando está cayendo cerca de plataformas
      if (physics.velocity.y < 0 && physics.velocity.y > -10) {
        gravityMultiplier = 0.8;
      }
      
      physics.velocity.y += physics.gravity * gravityMultiplier * delta;
    } else {
      // Estabilizar velocidad vertical cuando está en plataforma
      if (physics.velocity.y < 0) {
        physics.velocity.y *= 0.1;
      }
    }
    
    // Efecto rebote mejorado
    if (physics.bounceVelocity > 0 && physics.bounceCount < physics.maxBounces) {
      physics.velocity.y += physics.bounceVelocity;
      physics.bounceVelocity *= 0.6; // Rebote más pronunciado
      if (physics.bounceVelocity < 0.8) {
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
    
    // Colisión con el suelo mejorada - flotación
    const groundLevel = this.groundHoverHeight;
    if (transform.position[1] <= groundLevel) {
      transform.position[1] = groundLevel;
      
      // Rebote más dinámico
      if (physics.velocity.y < -8 && physics.bounceCount < physics.maxBounces) {
        physics.bounceVelocity = Math.abs(physics.velocity.y) * 0.3; // Rebote más fuerte
        physics.bounceCount++;
      }
      
      physics.velocity.y = 0;
      physics.isGrounded = true;
    }
  }
}