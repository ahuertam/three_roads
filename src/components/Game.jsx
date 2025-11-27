import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef } from 'react';
import useGameStore from '../store/gameStore';
import React from 'react';
import { OrbitControls } from '@react-three/drei';
import Ship from './Ship';
import Obstacles from './Obstacles';
import Track from './Track';
import Particles from './Particles';
import Starfield from './Starfield';
import Title3D from './Title3D';
// Remover: import CrashMessage from './CrashMessage';
import { useECS } from '../hooks/useECS';

function Game({ onInputSystemReady }) {
  const { shipEntity, obstacleEntities, particleEntities, inputSystem } = useECS();
  
  // Notificar al padre cuando inputSystem esté listo
  React.useEffect(() => {
    if (inputSystem && onInputSystemReady) {
      onInputSystemReady(inputSystem);
    }
  }, [inputSystem, onInputSystemReady]);
  
  return (
    <>
      {/* Fondo de estrellas */}
      <Starfield count={2000} />
      
      {/* Título 3D discreto en la parte superior */}
      <Title3D position={[0, 6, -80]} scale={0.8} opacity={0.5} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <Track />
      <Ship ecsEntity={shipEntity} />
      <Obstacles ecsEntities={obstacleEntities} />
      <Particles ecsEntities={particleEntities} />
      {/* Remover: <CrashMessage /> */}
    </>
  );
}

export default Game;