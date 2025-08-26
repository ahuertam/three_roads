import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Transform } from '../ecs/components/Transform.js';

function Obstacle({ ecsEntity }) {
  const obstacleRef = useRef();
  
  useFrame(() => {
    if (!obstacleRef.current || !ecsEntity) return;
    
    const transform = ecsEntity.getComponent(Transform);
    if (transform) {
      obstacleRef.current.position.set(...transform.position);
    }
  });
  
  if (!ecsEntity || !ecsEntity.size) return null;
  
  return (
    <mesh
      ref={obstacleRef}
      castShadow
      receiveShadow
    >
      <boxGeometry args={ecsEntity.size} />
      <meshStandardMaterial 
        color="#ff4444" 
        metalness={0.3} 
        roughness={0.7}
      />
    </mesh>
  );
}

function Obstacles({ ecsEntities = [] }) {
  return (
    <group>
      {ecsEntities.map(entity => (
        <Obstacle key={entity.id} ecsEntity={entity} />
      ))}
    </group>
  );
}

export default Obstacles;