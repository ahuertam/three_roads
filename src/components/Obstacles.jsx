import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import useGameStore from '../store/gameStore';
import * as THREE from 'three';

function Obstacle({ position, id, size = [8, 2, 8] }) {
  const obstacleRef = useRef();
  
  return (
    <Box
      ref={obstacleRef}
      position={position}
      args={size}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial 
        color="#ff4444" 
        metalness={0.3} 
        roughness={0.7}
      />
    </Box>
  );
}

function Obstacles() {
  const [obstacles, setObstacles] = useState([]);
  const nextObstacleId = useRef(0);
  const spawnTimer = useRef(0);
  const patternIndex = useRef(0);
  const { 
    shipPosition, 
    setShipPosition, 
    handleCollision, 
    gameTime, 
    updateGameTime 
  } = useGameStore();
  
  // Patrones de obstáculos optimizados
  const obstaclePatterns = [
    // Patrón 1: Escalones ascendentes
    [
      { x: -12, y: 1, z: 0, size: [8, 2, 12] },
      { x: -4, y: 2, z: -15, size: [8, 2, 12] },
      { x: 4, y: 3, z: -30, size: [8, 2, 12] },
      { x: 12, y: 2, z: -45, size: [8, 2, 12] }
    ],
    // Patrón 2: Plataformas en zigzag
    [
      { x: -15, y: 1, z: 0, size: [10, 2, 8] },
      { x: 0, y: 2, z: -20, size: [12, 2, 8] },
      { x: 15, y: 1, z: -40, size: [10, 2, 8] },
      { x: 0, y: 3, z: -60, size: [8, 2, 8] }
    ],
    // Patrón 3: Pista central
    [
      { x: 0, y: 1, z: 0, size: [12, 2, 15] },
      { x: 0, y: 2, z: -20, size: [10, 2, 15] },
      { x: 0, y: 3, z: -40, size: [8, 2, 15] }
    ],
    // Patrón 4: Obstáculos laterales
    [
      { x: -18, y: 1, z: 0, size: [8, 3, 20] },
      { x: 18, y: 1, z: 0, size: [8, 3, 20] },
      { x: 0, y: 3, z: -30, size: [8, 2, 10] }
    ]
  ];
  
  useFrame((state, delta) => {
    updateGameTime(delta);
    spawnTimer.current += delta;
    
    // Generar obstáculos cada 6 segundos
    if (spawnTimer.current > 6 && gameTime < 60) {
      const pattern = obstaclePatterns[patternIndex.current % obstaclePatterns.length];
      const baseZ = shipPosition[2] - 60;
      
      const newObstacles = pattern.map(obstacle => ({
        id: nextObstacleId.current++,
        position: [obstacle.x, obstacle.y, baseZ + obstacle.z],
        size: obstacle.size
      }));
      
      setObstacles(prev => {
        const combined = [...prev, ...newObstacles];
        return combined.slice(-15);
      });
      
      patternIndex.current++;
      spawnTimer.current = 0;
    }
    
    // LÓGICA DE COLISIÓN Y PLATAFORMAS OPTIMIZADA
    let onPlatform = false;
    let platformHeight = 0;
    let hasCollided = false;
    
    // Solo verificar obstáculos cercanos (optimización clave)
    const nearbyObstacles = obstacles.filter(obstacle => {
      const distance = Math.abs(obstacle.position[2] - shipPosition[2]);
      return distance < 12; // Solo obstáculos muy cercanos
    });
    
    // Dimensiones exactas de la nave
    const shipBox = {
      minX: shipPosition[0] - 1.5, // nave: 3 de ancho
      maxX: shipPosition[0] + 1.5,
      minY: shipPosition[1] - 0.4, // nave: 0.8 de alto
      maxY: shipPosition[1] + 0.4,
      minZ: shipPosition[2] - 3,   // nave: 6 de largo
      maxZ: shipPosition[2] + 3
    };
    
    for (const obstacle of nearbyObstacles) {
      const { position, size } = obstacle;
      
      const obstacleBox = {
        minX: position[0] - size[0]/2,
        maxX: position[0] + size[0]/2,
        minY: position[1] - size[1]/2,
        maxY: position[1] + size[1]/2,
        minZ: position[2] - size[2]/2,
        maxZ: position[2] + size[2]/2
      };
      
      // Verificar si está horizontalmente sobre el obstáculo
      const isHorizontallyOver = (
        shipBox.minX < obstacleBox.maxX &&
        shipBox.maxX > obstacleBox.minX &&
        shipBox.minZ < obstacleBox.maxZ &&
        shipBox.maxZ > obstacleBox.minZ
      );
      
      if (isHorizontallyOver) {
        const distanceToTop = shipPosition[1] - obstacleBox.maxY;
        
        // Verificar si está sobre la plataforma (aterrizaje suave)
        if (distanceToTop >= -0.8 && distanceToTop <= 1.2) {
          onPlatform = true;
          platformHeight = Math.max(platformHeight, obstacleBox.maxY);
        }
        
        // Verificar colisión frontal/lateral (intersección completa)
        const intersects = (
          shipBox.minY < obstacleBox.maxY &&
          shipBox.maxY > obstacleBox.minY
        );
        
        // Si hay intersección Y no está claramente encima = COLISIÓN
        if (intersects && distanceToTop < -0.8) {
          hasCollided = true;
          break; // Salir del bucle inmediatamente
        }
      }
    }
    
    // Manejar colisión
    if (hasCollided) {
      console.log('¡COLISIÓN DETECTADA!');
      handleCollision();
      return; // Salir temprano si hay colisión
    }
    
    // Actualizar estado de plataforma
    useGameStore.setState({ 
      onPlatform, 
      platformHeight: onPlatform ? platformHeight + 0.5 : 0 
    });
    
    // Limpiar obstáculos viejos (menos frecuente para rendimiento)
    if (Math.floor(state.clock.elapsedTime * 0.5) % 3 === 0) {
      setObstacles(prev => 
        prev.filter(obstacle => obstacle.position[2] > shipPosition[2] - 80)
      );
    }
  });
  
  return (
    <group>
      {obstacles.map(obstacle => (
        <Obstacle
          key={obstacle.id}
          id={obstacle.id}
          position={obstacle.position}
          size={obstacle.size || [8, 2, 8]}
        />
      ))}
    </group>
  );
}

export default Obstacles;