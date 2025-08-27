import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Transform } from '../ecs/components/Transform.js';

function Obstacle({ ecsEntity }) {
  const obstacleRef = useRef();
  
  // Tipos de plataformas según SkyRoads
  const platformTypes = {
    NORMAL: { color: '#666666', effect: 'none' },
    SUPPLIES: { color: '#87CEEB', effect: 'supplies' }, // Azul claro
    BOOST: { color: '#32CD32', effect: 'boost' },       // Verde
    STICKY: { color: '#90EE90', effect: 'sticky' },     // Verde claro
    SLIPPERY: { color: '#708090', effect: 'slippery' }, // Gris
    BURNING: { color: '#FF6347', effect: 'burning' }    // Rojo/naranja
  };
  
  useFrame(() => {
    if (!obstacleRef.current || !ecsEntity) return;
    
    const transform = ecsEntity.getComponent(Transform);
    if (transform) {
      obstacleRef.current.position.set(...transform.position);
    }
  });
  
  if (!ecsEntity || !ecsEntity.size) return null;
  
  const platformType = ecsEntity.platformType || 'NORMAL';
  const platformConfig = platformTypes[platformType];
  
  return (
    <mesh
      ref={obstacleRef}
      castShadow
      receiveShadow
    >
      <boxGeometry args={ecsEntity.size} />
      <meshStandardMaterial 
        color={platformConfig.color}
        metalness={platformType === 'BURNING' ? 0.8 : 0.3}
        roughness={platformType === 'SLIPPERY' ? 0.1 : 0.7}
        emissive={platformType === 'BURNING' ? '#FF2000' : '#000000'}
        emissiveIntensity={platformType === 'BURNING' ? 0.3 : 0}
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