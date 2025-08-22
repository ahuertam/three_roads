import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import useGameStore from '../store/gameStore';

function Ship() {
  const meshRef = useRef();
  const {
    shipPosition,
    shipVelocity,
    setShipPosition,
    setShipVelocity,
    keys,
    isJumping,
    setJumping,
    gameState,
    isInvulnerable
  } = useGameStore();
  
  useFrame((state, delta) => {
    if (gameState !== 'playing') return;
    
    const ship = meshRef.current;
    if (!ship) return;
    
    // Física básica
    const gravity = -0.025;
    const jumpForce = 0.4;
    const moveSpeed = 0.2;
    const maxX = 2.8;
    
    let newVelocity = { ...shipVelocity };
    let newPosition = { ...shipPosition };
    
    // Movimiento lateral (más responsivo)
    if (keys.left && newPosition.x > -maxX) {
      newVelocity.x = -moveSpeed;
    } else if (keys.right && newPosition.x < maxX) {
      newVelocity.x = moveSpeed;
    } else {
      newVelocity.x *= 0.9;
    }
    
    // Salto
    if (keys.space && !isJumping && newPosition.y <= 0.6) {
      newVelocity.y = jumpForce;
      setJumping(true);
    }
    
    // Aplicar gravedad
    newVelocity.y += gravity;
    
    // Actualizar posición
    newPosition.x += newVelocity.x;
    newPosition.y += newVelocity.y;
    newPosition.z += newVelocity.z;
    
    // Límites del suelo (sin verificación de agujeros)
    if (newPosition.y <= 0.5) {
      newPosition.y = 0.5;
      newVelocity.y = 0;
      setJumping(false);
    }
    
    // Límites laterales
    newPosition.x = Math.max(-maxX, Math.min(maxX, newPosition.x));
    
    // Actualizar estado
    setShipPosition(newPosition);
    setShipVelocity(newVelocity);
    
    // Actualizar posición del mesh
    ship.position.set(newPosition.x, newPosition.y, newPosition.z);
    
    // Rotación basada en movimiento
    ship.rotation.z = -newVelocity.x * 0.4;
    ship.rotation.x = newVelocity.y * 0.3;
    
    // Efecto de parpadeo cuando es invulnerable
    if (isInvulnerable) {
      ship.visible = Math.sin(state.clock.elapsedTime * 10) > 0;
    } else {
      ship.visible = true;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[shipPosition.x, shipPosition.y, shipPosition.z]} castShadow>
      <Box args={[0.8, 0.3, 1.2]}>
        <meshStandardMaterial color="#00ff88" emissive="#004422" />
      </Box>
      {/* Detalles de la nave */}
      <mesh position={[0, 0.2, 0.3]}>
        <Box args={[0.3, 0.1, 0.3]}>
          <meshStandardMaterial color="#0088ff" emissive="#002244" />
        </Box>
      </mesh>
      <mesh position={[0, 0, -0.7]}>
        <Box args={[0.4, 0.1, 0.2]}>
          <meshStandardMaterial color="#ff4400" emissive="#441100" />
        </Box>
      </mesh>
    </mesh>
  );
}

export default Ship;