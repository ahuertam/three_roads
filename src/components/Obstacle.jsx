import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';
import useGameStore from '../store/gameStore';

function Obstacle({ position, type = 'box', onCollision }) {
  const meshRef = useRef();
  const { speed, gameState } = useGameStore();
  const [currentPosition, setCurrentPosition] = useState(position);
  
  useFrame(() => {
    if (gameState === 'playing' && meshRef.current) {
      const newZ = currentPosition[2] + speed;
      setCurrentPosition([currentPosition[0], currentPosition[1], newZ]);
      meshRef.current.position.set(currentPosition[0], currentPosition[1], newZ);
      
      // Verificar colisión con el jugador
      const shipPos = useGameStore.getState().shipPosition;
      const distance = Math.sqrt(
        Math.pow(currentPosition[0] - shipPos.x, 2) +
        Math.pow(currentPosition[1] - shipPos.y, 2) +
        Math.pow(newZ - shipPos.z, 2)
      );
      
      if (distance < 1) {
        onCollision && onCollision();
      }
      
      // Remover obstáculo si está muy lejos
      if (newZ > 15) {
        // El obstáculo será removido por el componente padre
      }
    }
  });
  
  const ObstacleGeometry = () => {
    switch (type) {
      case 'sphere':
        return (
          <Sphere args={[0.5]}>
            <meshStandardMaterial color="#ff4444" />
          </Sphere>
        );
      case 'tall':
        return (
          <Box args={[0.8, 2, 0.8]}>
            <meshStandardMaterial color="#4444ff" />
          </Box>
        );
      default:
        return (
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color="#ff8844" />
          </Box>
        );
    }
  };
  
  return (
    <mesh ref={meshRef} position={currentPosition} castShadow>
      <ObstacleGeometry />
    </mesh>
  );
}

export default Obstacle;