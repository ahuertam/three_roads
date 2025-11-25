import React from 'react';
import useGameStore from '../store/gameStore';
import { LEVELS } from '../levels/index';

function LevelSelector() {
  const { gameState, startLevel } = useGameStore();
  if (gameState !== 'menu') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      pointerEvents: 'auto'
    }}>
      <div style={{
        background: 'rgba(20, 20, 20, 0.95)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        border: '3px solid #00ff00',
        boxShadow: '0 0 30px #00ff0080',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h2 style={{
          margin: '0 0 20px 0',
          color: '#00ff00',
          fontSize: '32px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>Selecciona nivel</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id || idx}
              onClick={() => startLevel(idx)}
              style={{
                backgroundColor: '#111',
                color: '#fff',
                border: '2px solid #444',
                borderRadius: '10px',
                padding: '14px',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{
                fontSize: '14px',
                color: '#00ff00',
                marginBottom: '6px',
                fontWeight: 'bold'
              }}>LEVEL {idx + 1}</div>
              <div style={{ fontSize: '18px' }}>{lvl.name || 'Sin título'}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LevelSelector;