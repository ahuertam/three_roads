import React from 'react';
import useGameStore from '../store/gameStore';

function HUD() {
  const { distanceTraveled, gameState, supplies, currentEffect, currentLevel, levelIndex, maxScore } = useGameStore();
  
  if (gameState !== 'playing') return null;
  
  return (
    <>
      {/* Nombre del Nivel (Arriba Centro) */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#00ff00',
        padding: '10px 30px',
        borderRadius: '20px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontWeight: 'bold',
        border: '2px solid #00ff00',
        boxShadow: '0 0 15px rgba(0, 255, 0, 0.4)',
        zIndex: 1000,
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        LEVEL {levelIndex + 1}: {currentLevel?.name || 'Unknown'}
        <div style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#ffffff',
          fontWeight: 'normal',
        }}>
          MEJOR: {maxScore || 0}m
        </div>
      </div>

      {/* HUD principal (esquina inferior derecha) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000
      }}>
        {/* Contador de distancia */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '10px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          fontWeight: 'bold',
          border: '2px solid #00ff00',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          <div style={{
            color: '#00ff00',
            fontSize: '14px',
            marginBottom: '5px'
          }}>
            DISTANCIA
          </div>
          <div style={{
            fontSize: '24px',
            color: '#ffffff'
          }}>
            {distanceTraveled || 0}m
          </div>
        </div>
        
        {/* Medidor de suministros */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '10px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          fontWeight: 'bold',
          border: '2px solid #87CEEB',
          boxShadow: '0 0 10px rgba(135, 206, 235, 0.3)',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          <div style={{
            color: '#87CEEB',
            fontSize: '12px',
            marginBottom: '5px'
          }}>
            SUMINISTROS
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#333',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '5px'
          }}>
            <div style={{
              width: `${supplies}%`,
              height: '100%',
              backgroundColor: supplies > 50 ? '#32CD32' : supplies > 25 ? '#FFD700' : '#FF6347',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            fontSize: '12px',
            color: '#ffffff'
          }}>
            {Math.round(supplies)}%
          </div>
        </div>
        
        {/* Indicador de efecto activo */}
        {currentEffect !== 'none' && (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}>
            {currentEffect}
          </div>
        )}
      </div>

      {/* Leyenda de colores de plataformas (esquina inferior izquierda) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        border: '2px solid #444',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        zIndex: 1000
      }}>
        <div style={{
          color: '#FFD700',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          PLATAFORMAS
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {/* Plataforma Normal */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#666666',
              borderRadius: '3px',
              border: '1px solid #888'
            }} />
            <span>Normal</span>
          </div>
          
          {/* Plataforma de Suministros */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#87CEEB',
              borderRadius: '3px',
              border: '1px solid #5F9EA0'
            }} />
            <span>Suministros</span>
          </div>
          
          {/* Plataforma de Impulso */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#32CD32',
              borderRadius: '3px',
              border: '1px solid #228B22'
            }} />
            <span>Impulso</span>
          </div>
          
          {/* Plataforma Pegajosa */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#90EE90',
              borderRadius: '3px',
              border: '1px solid #98FB98'
            }} />
            <span>Pegajosa</span>
          </div>
          
          {/* Plataforma Resbaladiza */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#FFA500',
              borderRadius: '3px',
              border: '1px solid #FF8C00'
            }} />
            <span>Resbaladiza</span>
          </div>
          
          {/* Plataforma Ardiente */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#FF6347',
              borderRadius: '3px',
              border: '1px solid #DC143C'
            }} />
            <span>Ardiente</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default HUD;