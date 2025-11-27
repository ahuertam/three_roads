import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Starfield({ count = 2000 }) {
  const points = useRef();
  const { camera } = useThree();
  
  // Generar posiciones aleatorias de estrellas
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribuir estrellas en un gran cubo alrededor de la escena
      positions[i * 3] = (Math.random() - 0.5) * 200; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z
    }
    
    return positions;
  }, [count]);
  
  // Hacer que las estrellas sigan la cámara
  useFrame(() => {
    if (points.current && camera) {
      // Las estrellas siguen la posición de la cámara
      points.current.position.x = camera.position.x;
      points.current.position.y = camera.position.y;
      points.current.position.z = camera.position.z;
      
      // Rotación muy lenta para efecto sutil
      points.current.rotation.y += 0.0001;
    }
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        sizeAttenuation={false}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
}

export default Starfield;
