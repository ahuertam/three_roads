import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Transform } from '../ecs/components/Transform.js';
import { Physics } from '../ecs/components/Physics.js';
import { Input } from '../ecs/components/Input.js';

function Ship({ ecsEntity }) {
  const shipRef = useRef();
  const { camera } = useThree();
  
  useFrame(() => {
    if (!shipRef.current || !ecsEntity) return;
    
    const transform = ecsEntity.getComponent(Transform);
    const physics = ecsEntity.getComponent(Physics);
    const input = ecsEntity.getComponent(Input);
    
    if (transform) {
      shipRef.current.position.set(...transform.position);
      
      let rotationX = 0; // Pitch (arriba/abajo)
      let rotationY = 3.2; // Sin rotación Y - la nave mira hacia Z negativo naturalmente
      let rotationZ = 0; // Roll (izquierda/derecha)
      
      if (physics) {
        // Inclinación hacia arriba/abajo basada en velocidad vertical
        rotationX = Math.max(-0.3, Math.min(0.3, physics.velocity.y * 0.05));
        
        // Inclinación lateral basada en velocidad horizontal
        rotationZ = Math.max(-0.2, Math.min(0.2, physics.velocity.x * 0.03));
        
        // Inclinación adicional cuando está girando
        if (input) {
          if (input.keys.left) {
            rotationZ -= 0.18; // Inclinar hacia la izquierda
          }
          if (input.keys.right) {
            rotationZ += 0.18; // Inclinar hacia la derecha
          }
        }
      }
      
      // Aplicar rotaciones suavemente
      shipRef.current.rotation.x = rotationX;
      shipRef.current.rotation.y = rotationY;
      shipRef.current.rotation.z = rotationZ;
      
      camera.position.x = transform.position[0];
      camera.position.y = transform.position[1] + 8;
      camera.position.z = transform.position[2] + 20;
      // La cámara mira hacia donde se dirige la nave (Z negativo)
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
      
      {/* Motores laterales - en la parte trasera */}
      <mesh position={[-1.5, 0.2, -1]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.5]} />
        <meshStandardMaterial color="#2266cc" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.5, 0.2, -1]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.5]} />
        <meshStandardMaterial color="#2266cc" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Cabina - en la parte delantera */}
      <mesh position={[0, 0.8, 0.5]} castShadow>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshStandardMaterial color="#1144aa" metalness={0.5} roughness={0.5} opacity={1.0} />
      </mesh>
      
      {/* Propulsores - en la parte más trasera */}
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