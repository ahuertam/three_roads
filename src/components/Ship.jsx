import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Transform } from '../ecs/components/Transform.js';

function Ship({ ecsEntity }) {
  const shipRef = useRef();
  const { camera } = useThree();
  
  useFrame(() => {
    if (!shipRef.current || !ecsEntity) return;
    
    const transform = ecsEntity.getComponent(Transform);
    if (transform) {
      shipRef.current.position.set(...transform.position);
      
      // Actualizar cámara
      camera.position.x = transform.position[0];
      camera.position.y = transform.position[1] + 8;
      camera.position.z = transform.position[2] + 20;
      camera.lookAt(transform.position[0], transform.position[1], transform.position[2] - 10);
    }
  });
  
  if (!ecsEntity) return null;
  
  return (
    <group ref={shipRef}>
      {/* Cuerpo principal */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial color="#4488ff" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Motores laterales */}
      <mesh position={[-1.5, 0.2, -1]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.5]} />
        <meshStandardMaterial color="#2266cc" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.5, 0.2, -1]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.5]} />
        <meshStandardMaterial color="#2266cc" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Cabina */}
      <mesh position={[0, 0.8, 0.5]} castShadow>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshStandardMaterial color="#1144aa" metalness={0.5} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      
      {/* Propulsores */}
      <mesh position={[-1.5, 0.2, -2]} castShadow>
        <cylinderGeometry args={[0.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#00BFFF" emissive="#0088cc" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.5, 0.2, -2]} castShadow>
        <cylinderGeometry args={[0.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#00BFFF" emissive="#0088cc" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default Ship;