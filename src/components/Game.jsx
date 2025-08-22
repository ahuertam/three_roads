import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import Ship from './Ship';
import Track from './Track';
import Obstacle from './Obstacle';
import useGameStore from '../store/gameStore';

function Game() {
  const {
    gameState,
    score,
    lives,
    level,
    speed,
    obstacles,
    setKey,
    increaseSpeed,
    updateScore,
    addObstacle,
    removeObstacle,
    handleCollision,
    startGame,
    resetToMenu
  } = useGameStore();
  
  const obstacleSpawnTimer = useRef(0);
  
  // Manejo de controles
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setKey('left', true);
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKey('right', true);
          break;
        case 'ArrowUp':
        case 'KeyW':
          setKey('up', true);
          break;
        case 'ArrowDown':
        case 'KeyS':
          setKey('down', true);
          break;
        case 'Space':
          setKey('space', true);
          event.preventDefault();
          break;
        case 'Enter':
          if (gameState === 'menu') {
            startGame();
          } else if (gameState === 'gameOver') {
            resetToMenu();
          }
          break;
      }
    };
    
    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setKey('left', false);
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKey('right', false);
          break;
        case 'ArrowUp':
        case 'KeyW':
          setKey('up', false);
          break;
        case 'ArrowDown':
        case 'KeyS':
          setKey('down', false);
          break;
        case 'Space':
          setKey('space', false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setKey, gameState, startGame, resetToMenu]);
  
  // Lógica del juego
  useFrame((state, delta) => {
    if (gameState === 'playing') {
      // Incrementar puntuación
      updateScore(Math.floor(speed * 10));
      
      // Incrementar velocidad gradualmente
      if (Math.random() < 0.002) {
        increaseSpeed();
      }
      
      // Generar obstáculos
      obstacleSpawnTimer.current += delta;
      const spawnRate = Math.max(0.5, 2 - level * 0.1); // Más obstáculos en niveles altos
      
      if (obstacleSpawnTimer.current > spawnRate) {
        obstacleSpawnTimer.current = 0;
        
        // Generar obstáculo aleatorio
        const types = ['box', 'sphere', 'tall'];
        const type = types[Math.floor(Math.random() * types.length)];
        const x = (Math.random() - 0.5) * 6; // Posición aleatoria en la pista
        const y = type === 'tall' ? 1 : 0.5;
        
        addObstacle({
          position: [x, y, -20],
          type: type
        });
      }
      
      // Limpiar obstáculos que han pasado
      obstacles.forEach(obstacle => {
        if (obstacle.position && obstacle.position[2] > 15) {
          removeObstacle(obstacle.id);
        }
      });
    }
  });
  
  const GameUI = () => {
    if (gameState === 'menu') {
      return (
        <Html center>
          <div style={{
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.7)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h1>SkyRoads Clone</h1>
            <p>Usa las flechas o WASD para moverte</p>
            <p>Barra espaciadora para saltar</p>
            <p>Presiona ENTER para comenzar</p>
          </div>
        </Html>
      );
    }
    
    if (gameState === 'gameOver') {
      return (
        <Html center>
          <div style={{
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.7)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h1>Game Over</h1>
            <p>Puntuación Final: {score}</p>
            <p>Nivel Alcanzado: {level}</p>
            <p>Presiona ENTER para volver al menú</p>
          </div>
        </Html>
      );
    }
    
    if (gameState === 'playing') {
      return (
        <Html position={[-8, 6, 0]}>
          <div style={{
            color: 'white',
            fontSize: '18px',
            background: 'rgba(0,0,0,0.5)',
            padding: '10px',
            borderRadius: '5px'
          }}>
            <div>Puntuación: {score}</div>
            <div>Vidas: {lives}</div>
            <div>Nivel: {level}</div>
            <div>Velocidad: {(speed * 100).toFixed(0)}%</div>
          </div>
        </Html>
      );
    }
    
    return null;
  };
  
  return (
    <group>
      <Track />
      <Ship />
      
      {/* Renderizar obstáculos */}
      {obstacles.map((obstacle) => (
        <Obstacle
          key={obstacle.id}
          position={obstacle.position}
          type={obstacle.type}
          onCollision={() => {
            handleCollision();
            removeObstacle(obstacle.id);
          }}
        />
      ))}
      
      <GameUI />
    </group>
  );
}

export default Game;