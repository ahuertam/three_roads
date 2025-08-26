import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef } from 'react';
import useGameStore from '../store/gameStore';
import React from 'react';
import { OrbitControls } from '@react-three/drei';
import Ship from './Ship';
import Obstacles from './Obstacles';
import Track from './Track';
import { useECS } from '../hooks/useECS';

function Game() {
  const { shipEntity, obstacleEntities } = useECS();
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <Track />
      <Ship ecsEntity={shipEntity} />
      <Obstacles ecsEntities={obstacleEntities} />
      
      {/* <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} /> */}
    </>
  );
}

export default Game;