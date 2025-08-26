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
    <mesh ref={shipRef} castShadow>
      <boxGeometry args={[3, 0.8, 6]} />
      <meshStandardMaterial color="#4488ff" metalness={0.6} roughness={0.3} />
      
      {/* Motores laterales */}
      <mesh position={[-2, -0.5, -1]} castShadow>
        <boxGeometry args={[0.8, 1.2, 3]} />
        <meshStandardMaterial color="#2266cc" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[2, -0.5, -1]} castShadow>
        <boxGeometry args={[0.8, 1.2, 3]} />
        <meshStandardMaterial color="#2266cc" metalness={0.7} roughness={0.2} />
      </mesh>
      
      {/* Cabina */}
      <mesh position={[0, 0.6, 1]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#1144aa" metalness={0.8} roughness={0.1} transparent opacity={0.9} />
      </mesh>
      
      {/* Efectos de propulsión */}
      <mesh position={[-2, -1, -3]} castShadow>
        <boxGeometry args={[0.3, 0.3, 1]} />
        <meshStandardMaterial color="#00ffff" emissive="#0088ff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2, -1, -3]} castShadow>
        <boxGeometry args={[0.3, 0.3, 1]} />
        <meshStandardMaterial color="#00ffff" emissive="#0088ff" emissiveIntensity={0.5} />
      </mesh>
    </mesh>
  );
}

export default Ship;