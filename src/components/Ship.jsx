import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import useGameStore from '../store/gameStore';

function Ship() {
  const shipRef = useRef();
  const { camera } = useThree();
  const { shipPosition, setShipPosition } = useGameStore();
  
  const keys = useRef({
    left: false,
    right: false,
    forward: false,
    backward: false,
    jump: false
  });
  
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const isGrounded = useRef(true);
  const baseSpeed = useRef(5);
  const bounceVelocity = useRef(0);
  const bounceCount = useRef(0); // Contador de rebotes
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch(event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keys.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keys.current.right = true;
          break;
        case 'ArrowUp':
        case 'KeyW':
          keys.current.forward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          keys.current.backward = true;
          break;
        case 'Space':
          keys.current.jump = true;
          event.preventDefault();
          break;
      }
    };
    
    const handleKeyUp = (event) => {
      switch(event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keys.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keys.current.right = false;
          break;
        case 'ArrowUp':
        case 'KeyW':
          keys.current.forward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          keys.current.backward = false;
          break;
        case 'Space':
          keys.current.jump = false;
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useFrame((state, delta) => {
    if (!shipRef.current) return;
    
    const lateralSpeed = 12;
    const accelerationSpeed = 15;
    const jumpForce = 12;
    const gravity = -25;
    const friction = 0.85;
    const bounceForce = 6; // Reducido
    const bounceDamping = 0.5; // Más amortiguación
    const groundLevel = 0.5;
    const maxBounces = 2; // Máximo 2 rebotes
    
    // Movimiento lateral
    if (keys.current.left) {
      velocity.current.x = -lateralSpeed;
    } else if (keys.current.right) {
      velocity.current.x = lateralSpeed;
    } else {
      velocity.current.x *= friction;
    }
    
    // Movimiento hacia adelante
    if (keys.current.forward) {
      baseSpeed.current = Math.min(baseSpeed.current + accelerationSpeed * delta, 20);
    } else if (keys.current.backward) {
      baseSpeed.current = Math.max(baseSpeed.current - accelerationSpeed * delta, 2);
    } else {
      baseSpeed.current = Math.max(baseSpeed.current * 0.98, 5);
    }
    
    velocity.current.z = -baseSpeed.current;
    
    // Salto
    if (keys.current.jump && isGrounded.current) {
      velocity.current.y = jumpForce;
      isGrounded.current = false;
      bounceCount.current = 0; // Resetear contador al saltar
    }
    
    // Aplicar gravedad
    velocity.current.y += gravity * delta;
    
    // Aplicar efecto rebote (limitado)
    if (bounceVelocity.current > 0 && bounceCount.current < maxBounces) {
      velocity.current.y += bounceVelocity.current;
      bounceVelocity.current *= bounceDamping;
      if (bounceVelocity.current < 0.5) { // Umbral más alto para parar rebotes
        bounceVelocity.current = 0;
      }
    } else {
      bounceVelocity.current = 0; // Forzar parada si excede rebotes
    }
    
    // Actualizar posición
    const newPosition = [
      shipPosition[0] + velocity.current.x * delta,
      shipPosition[1] + velocity.current.y * delta,
      shipPosition[2] + velocity.current.z * delta
    ];
    
    // Verificar colisión con el suelo
    if (newPosition[1] <= groundLevel) {
      newPosition[1] = groundLevel;
      
      // Efecto rebote limitado
      if (velocity.current.y < -8 && bounceCount.current < maxBounces) {
        bounceVelocity.current = Math.abs(velocity.current.y) * 0.2; // Rebote más suave
        bounceCount.current++;
      } else {
        bounceVelocity.current = 0;
      }
      
      velocity.current.y = 0;
      isGrounded.current = true;
    } else {
      isGrounded.current = false;
    }
    
    // Limitar movimiento lateral
    newPosition[0] = Math.max(-40, Math.min(40, newPosition[0]));
    
    setShipPosition(newPosition);
    shipRef.current.position.set(...newPosition);
    
    // Cámara que sigue a la nave
    camera.position.x = newPosition[0];
    camera.position.y = newPosition[1] + 8;
    camera.position.z = newPosition[2] + 20;
    camera.lookAt(newPosition[0], newPosition[1], newPosition[2] - 10);
  });
  
  return (
    <mesh ref={shipRef} position={shipPosition} castShadow>
      {/* Cuerpo principal del landspeeder */}
      <Box args={[3, 0.8, 6]}>
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Motores laterales */}
      <mesh position={[-2, -0.5, -1]} castShadow>
        <Box args={[0.8, 1.2, 3]}>
          <meshStandardMaterial color="#404040" metalness={0.6} roughness={0.3} />
        </Box>
      </mesh>
      <mesh position={[2, -0.5, -1]} castShadow>
        <Box args={[0.8, 1.2, 3]}>
          <meshStandardMaterial color="#404040" metalness={0.6} roughness={0.3} />
        </Box>
      </mesh>
      
      {/* Cabina */}
      <mesh position={[0, 0.6, 1]} castShadow>
        <Box args={[2, 1, 2]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
        </Box>
      </mesh>
      
      {/* Efectos de propulsión */}
      <mesh position={[-2, -1, -3]} castShadow>
        <Box args={[0.3, 0.3, 1]}>
          <meshStandardMaterial color="#00ffff" emissive="#0088ff" emissiveIntensity={0.5} />
        </Box>
      </mesh>
      <mesh position={[2, -1, -3]} castShadow>
        <Box args={[0.3, 0.3, 1]}>
          <meshStandardMaterial color="#00ffff" emissive="#0088ff" emissiveIntensity={0.5} />
        </Box>
      </mesh>
    </mesh>
  );
}

export default Ship;