import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { GameManager } from '../ecs/GameManager.js';
import useGameStore from '../store/gameStore.js';

export function useECS() {
  const gameManager = useRef(null);
  const gameStore = useGameStore();
  
  useEffect(() => {
    gameManager.current = new GameManager(gameStore);
    gameManager.current.start();
    
    return () => {
      if (gameManager.current) {
        gameManager.current.destroy();
      }
    };
  }, []);
  
  useFrame((state, delta) => {
    if (gameManager.current) {
      gameManager.current.update(delta);
    }
  });
  
  return {
    gameManager: gameManager.current,
    shipEntity: gameManager.current?.getShipEntity(),
    obstacleEntities: gameManager.current?.getObstacleEntities() || []
  };
}