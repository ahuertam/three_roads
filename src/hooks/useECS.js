import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStore from '../store/gameStore.js';
import { GameManager } from '../ecs/GameManager.js';

export function useECS() {
  const gameManager = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Pasar el store instance (useGameStore) en lugar del snapshot
    gameManager.current = new GameManager(useGameStore);
    gameManager.current.start();
    setIsReady(true);
    
    return () => {
      if (gameManager.current) {
        gameManager.current.destroy();
      }
    };
  }, []);
  
  const [entityVersion, setEntityVersion] = useState(0);
  const lastEntityCount = useRef(0);

  useFrame((state, delta) => {
    if (gameManager.current) {
      gameManager.current.update(delta);
      
      // Check if we need to re-render React components (e.g. new obstacles)
      const currentCount = gameManager.current.ecsManager.entities.size;
      if (currentCount !== lastEntityCount.current) {
        lastEntityCount.current = currentCount;
        setEntityVersion(v => v + 1);
      }
    }
  });
  
  return {
    shipEntity: gameManager.current?.getShipEntity(),
    obstacleEntities: gameManager.current?.getObstacleEntities() || [],
    particleEntities: gameManager.current?.getParticleEntities() || [],
    inputSystem: gameManager.current?.inputSystem
  };
}