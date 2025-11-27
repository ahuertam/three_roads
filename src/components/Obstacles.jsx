import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Transform } from '../ecs/components/Transform.js';
import * as THREE from 'three';

function Obstacle({ ecsEntity }) {
  const obstacleRef = useRef();
  const edgesRef = useRef();
  
  // Tipos de plataformas según SkyRoads
  const platformTypes = {
    NORMAL: { color: '#6B5B95', effect: 'none' },
    SUPPLIES: { color: '#87CEEB', effect: 'supplies' }, // Azul claro
    BOOST: { color: '#32CD32', effect: 'boost' },       // Verde
    STICKY: { color: '#90EE90', effect: 'sticky' },     // Verde claro
    SLIPPERY: { color: '#FFA500', effect: 'slippery' }, // Naranja
    BURNING: { color: '#FF6347', effect: 'burning' },   // Rojo/naranja
    GOAL: { color: '#FFD700', effect: 'goal' },          // Dorado
    BLOCK: { color: '#8B4513', effect: 'none' }          // Marrón
  };
  
  useFrame(() => {
    if (!obstacleRef.current || !ecsEntity) return;
    
    const transform = ecsEntity.getComponent(Transform);
    if (transform) {
      obstacleRef.current.position.set(...transform.position);
      if (edgesRef.current) {
        edgesRef.current.position.set(...transform.position);
      }
    }
  });
  
  if (!ecsEntity || !ecsEntity.size) return null;
  
  const platformType = ecsEntity.platformType || 'NORMAL';
  const platformConfig = platformTypes[platformType];
  
  return (
    <group>
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
          emissive={platformType === 'BURNING' ? '#FF2000' : (platformType === 'GOAL' ? '#FFD700' : '#000000')}
          emissiveIntensity={platformType === 'BURNING' ? 0.3 : (platformType === 'GOAL' ? 0.5 : 0)}
        />
      </mesh>
      
      {/* Bordes naranja rojizo para visualizar mejor las colisiones */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(...ecsEntity.size)]} />
        <lineBasicMaterial color="#FF4500" linewidth={3} />
      </lineSegments>
    </group>
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