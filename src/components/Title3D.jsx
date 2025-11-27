import React from 'react';
import { Text3D, Center } from '@react-three/drei';

function Title3D({ position = [0, 15, -30], scale = 1, opacity = 1 }) {
  return (
    <Center position={position}>
        <Text3D
          font={`${process.env.PUBLIC_URL}/fonts/helvetiker_bold.typeface.json`}
          size={2 * scale}
          height={0.3}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Three-Roads
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={opacity}
          />
        </Text3D>
    </Center>
  );
}

export default Title3D;
