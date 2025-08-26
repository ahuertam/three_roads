import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Particle } from '../components/Particle.js';

export class ParticleSystem {
  constructor(ecsManager) {
    this.ecsManager = ecsManager;
  }
  
  update(delta) {
    const particleEntities = this.ecsManager.getEntitiesWithTag('particle');
    
    particleEntities.forEach(entity => {
      const particle = entity.getComponent(Particle);
      const transform = entity.getComponent(Transform);
      const physics = entity.getComponent(Physics);
      
      if (particle && transform && physics) {
        // Actualizar física de la partícula
        physics.velocity.y += physics.gravity * delta;
        physics.velocity.x *= 0.98; // Fricción del aire
        physics.velocity.z *= 0.98;
        
        // Actualizar posición
        transform.position[0] += physics.velocity.x * delta;
        transform.position[1] += physics.velocity.y * delta;
        transform.position[2] += physics.velocity.z * delta;
        
        // Actualizar partícula y eliminar si ha expirado
        if (!particle.update(delta)) {
          this.ecsManager.removeEntity(entity);
        }
      }
    });
  }
  
  createExplosion(position, particleCount = 25) {
    for (let i = 0; i < particleCount; i++) {
      const particle = this.ecsManager.createEntity('particle');
      
      // Posición inicial con pequeña variación
      const offsetX = (Math.random() - 0.5) * 2;
      const offsetY = (Math.random() - 0.5) * 2;
      const offsetZ = (Math.random() - 0.5) * 2;
      
      particle.addComponent(new Transform(
        position[0] + offsetX,
        position[1] + offsetY,
        position[2] + offsetZ
      ));
      
      // Física con velocidades aleatorias
      const physics = new Physics();
      physics.velocity.x = (Math.random() - 0.5) * 30;
      physics.velocity.y = Math.random() * 20 + 5;
      physics.velocity.z = (Math.random() - 0.5) * 30;
      physics.gravity = -25;
      particle.addComponent(physics);
      
      // Componente de partícula con propiedades aleatorias
      const lifespan = Math.random() * 1.5 + 0.5;
      const size = Math.random() * 0.3 + 0.1;
      const colors = ['#ff4444', '#ff8844', '#ffaa44', '#ffffff', '#ff6666'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.addComponent(new Particle(lifespan, size, color));
    }
  }
}