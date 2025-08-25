import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import useGameStore from '../store/gameStore';

function Ship() {
  const shipRef = useRef();
  const { camera } = useThree();
  const { shipPosition, setShipPosition, onPlatform, platformHeight } = useGameStore();
  
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
  const bounceCount = useRef(0);
  
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
    const bounceForce = 6;
    const bounceDamping = 0.5;
    const groundLevel = 0.5;
    const maxBounces = 2;
    
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
    const canJump = isGrounded.current || onPlatform;
    if (keys.current.jump && canJump) {
      velocity.current.y = jumpForce;
      isGrounded.current = false;
      bounceCount.current = 0;
    }
    
    // Gravedad - solo si no está en una plataforma
    if (!onPlatform) {
      velocity.current.y += gravity * delta;
    } else {
      // Si está en una plataforma, detener caída
      if (velocity.current.y < 0) {
        velocity.current.y = 0;
      }
    }
    
    // Aplicar efecto rebote (limitado)
    if (bounceVelocity.current > 0 && bounceCount.current < maxBounces) {
      velocity.current.y += bounceVelocity.current;
      bounceVelocity.current *= bounceDamping;
      if (bounceVelocity.current < 0.5) {
        bounceVelocity.current = 0;
      }
    } else {
      bounceVelocity.current = 0;
    }
    
    // Actualizar posición
    let newPosition = [
      shipPosition[0] + velocity.current.x * delta,
      shipPosition[1] + velocity.current.y * delta,
      shipPosition[2] + velocity.current.z * delta
    ];
    
    // Si está en una plataforma, usar la altura de la plataforma
    if (onPlatform && platformHeight > 0) {
      newPosition[1] = Math.max(newPosition[1], platformHeight);
      isGrounded.current = true;
    }
    
    // Verificar colisión con el suelo
    if (newPosition[1] <= groundLevel) {
      newPosition[1] = groundLevel;
      
      // Efecto rebote limitado
      if (velocity.current.y < -8 && bounceCount.current < maxBounces) {
        bounceVelocity.current = Math.abs(velocity.current.y) * 0.2;
        bounceCount.current++;
      } else {
        bounceVelocity.current = 0;
      }
      
      velocity.current.y = 0;
      isGrounded.current = true;
    } else if (!onPlatform) {
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
      {/* Cuerpo principal del landspeeder - Azul como SkyRoads */}
      <Box args={[3, 0.8, 6]}>
        <meshStandardMaterial color="#4488ff" metalness={0.6} roughness={0.3} />
      </Box>
      
      {/* Motores laterales - Azul más oscuro */}
      <mesh position={[-2, -0.5, -1]} castShadow>
        <Box args={[0.8, 1.2, 3]}>
          <meshStandardMaterial color="#2266cc" metalness={0.7} roughness={0.2} />
        </Box>
      </mesh>
      <mesh position={[2, -0.5, -1]} castShadow>
        <Box args={[0.8, 1.2, 3]}>
          <meshStandardMaterial color="#2266cc" metalness={0.7} roughness={0.2} />
        </Box>
      </mesh>
      
      {/* Cabina - Azul muy oscuro */}
      <mesh position={[0, 0.6, 1]} castShadow>
        <Box args={[2, 1, 2]}>
          <meshStandardMaterial color="#1144aa" metalness={0.8} roughness={0.1} transparent opacity={0.9} />
        </Box>
      </mesh>
      
      {/* Efectos de propulsión - Cyan brillante */}
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