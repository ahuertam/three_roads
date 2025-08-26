import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Transform } from '../ecs/components/Transform.js';
import { Particle } from '../ecs/components/Particle.js';

function ParticleInstance({ ecsEntity }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (!meshRef.current || !ecsEntity) return;
    
    const transform = ecsEntity.getComponent(Transform);
    const particle = ecsEntity.getComponent(Particle);
    
    if (transform && particle) {
      meshRef.current.position.set(...transform.position);
      meshRef.current.scale.setScalar(particle.size);
      meshRef.current.material.opacity = particle.opacity;
    }
  });
  
  if (!ecsEntity) return null;
  
  const particle = ecsEntity.getComponent(Particle);
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial 
        color={particle?.color || '#ff4444'} 
        transparent 
        opacity={particle?.opacity || 1}
      />
    </mesh>
  );
}

export function Particles({ ecsEntities }) {
  if (!ecsEntities || ecsEntities.length === 0) return null;
  
  return (
    <>
      {ecsEntities.map((entity, index) => (
        <ParticleInstance key={entity.id || index} ecsEntity={entity} />
      ))}
    </>
  );
}

export default Particles;