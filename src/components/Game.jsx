import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef } from 'react';
import useGameStore from '../store/gameStore';
import React from 'react';
import Ship from './Ship';
import Track from './Track';
import Obstacles from './Obstacles';

function Game() {
  const trackRef = useRef();
  const {
    gameState,
    score,
    lives,
    level,
    speed,
    gameTime,
    startGame,
    resetToMenu
  } = useGameStore();
  
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
            <p>Usa WASD o las flechas para moverte</p>
            <p>W/↑: Acelerar hacia adelante</p>
            <p>S/↓: Frenar</p>
            <p>A/←, D/→: Movimiento lateral</p>
            <p>Barra espaciadora: Saltar</p>
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
        <Html
          position={[0, 0, 0]}
          transform
          occlude
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <div style={{
            color: 'white',
            fontSize: '18px',
            background: 'rgba(0,0,0,0.8)',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid #00ff00',
            fontFamily: 'monospace',
            minWidth: '200px'
          }}>
            <div style={{ marginBottom: '5px' }}>🎯 Puntuación: {score}</div>
            <div style={{ marginBottom: '5px' }}>❤️ Vidas: {lives}</div>
            <div style={{ marginBottom: '5px' }}>🏁 Nivel: {level}</div>
            <div style={{ marginBottom: '5px' }}>⚡ Velocidad: {(speed * 100).toFixed(0)}%</div>
            <div style={{ marginBottom: '5px' }}>⏱️ Tiempo: {gameTime.toFixed(1)}s</div>
          </div>
        </Html>
      );
    }
    
    return null;
  };
  
  return (
    <group>
      <>
        {/* Luces */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Componentes del juego */}
        <Track ref={trackRef} />
        <Ship trackRef={trackRef} />
        <Obstacles />
      </>
      
      <GameUI />
    </group>
  );
}

export default Game;