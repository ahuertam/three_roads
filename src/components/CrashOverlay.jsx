import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../store/gameStore';

function CrashOverlay() {
  const { gameState, continueAfterCrash, restartGame, levelTime, bestTimes, currentLevel } = useGameStore();
  const [showMessage, setShowMessage] = useState(false);
  
  // Formatear tiempo en MM:SS.ms
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    if (gameState === 'crashed' || gameState === 'gameOver' || gameState === 'victory') {
      // Esperar 1 segundo antes de mostrar el mensaje
      const showTimer = setTimeout(() => {
        setShowMessage(true);
      }, 1000);
      
      const handleKeyPress = (event) => {
        if (event.code === 'Space' && showMessage) {
          event.preventDefault();
          
          // Esperar 1 segundo antes de continuar
          setTimeout(() => {
            if (gameState === 'gameOver' || gameState === 'victory') {
              restartGame();
            } else {
              continueAfterCrash();
              restartGame(); // Refresca la página
            }
          }, 1000);
        }
      };
      
      window.addEventListener('keydown', handleKeyPress);
      
      return () => {
        clearTimeout(showTimer);
        window.removeEventListener('keydown', handleKeyPress);
      };
    } else {
      setShowMessage(false);
    }
  }, [gameState, continueAfterCrash, restartGame, showMessage]);
  
  if ((gameState !== 'crashed' && gameState !== 'gameOver' && gameState !== 'victory') || !showMessage) {
    return null;
  }
  
  const isGameOver = gameState === 'gameOver';
  const isVictory = gameState === 'victory';
  
  let title = "¡Te has estrellado!";
  let borderColor = "#ff4444";
  let buttonText = "continuar";
  
  if (isGameOver) {
    title = "¡Juego Terminado!";
    borderColor = "#ff0000";
    buttonText = "reiniciar";
  } else if (isVictory) {
    title = "¡VICTORIA!";
    borderColor = "#FFD700"; // Dorado
    buttonText = "jugar de nuevo";
  }
  
  const { score, distanceTraveled, maxScore } = useGameStore.getState();
  
  const overlayElement = (
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
        padding: '40px',
        borderRadius: '15px',
        textAlign: 'center',
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        border: `3px solid ${borderColor}`,
        boxShadow: `0 0 30px ${borderColor}80`,
        maxWidth: '500px'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          color: borderColor,
          fontSize: '36px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>{title}</h2>
        
        {!isVictory && (
           <p style={{ fontSize: '24px', color: '#ffffff' }}>
             Puntuación: {distanceTraveled || 0}m
           </p>
        )}
        
        {isVictory && (
          <>
            <p style={{ fontSize: '24px', color: '#ffffff', marginBottom: '10px' }}>
              Distancia: {distanceTraveled || 0}m
            </p>
            <p style={{ 
              fontSize: '28px', 
              color: '#87CEEB',
              marginBottom: '5px',
              fontFamily: 'monospace'
            }}>
              Tiempo: {formatTime(levelTime)}
            </p>
            {(() => {
              const currentLevelId = currentLevel?.id || 'unknown';
              const previousBest = bestTimes[currentLevelId];
              const isNewRecord = !previousBest || levelTime < previousBest;
              
              return (
                <p style={{ 
                  fontSize: '16px', 
                  color: isNewRecord ? '#FFD700' : '#aaa',
                  marginTop: '5px'
                }}>
                  {isNewRecord ? '🏆 ¡NUEVO RÉCORD!' : `Mejor: ${formatTime(previousBest)}`}
                </p>
              );
            })()}
          </>
        )}
        
        <p style={{ 
          margin: '20px 0', 
          fontSize: '22px',
          color: '#ffffff'
        }}>Presiona SALTO para {buttonText}</p>
      <div style={{ 
        fontSize: '16px', 
        color: '#ccc',
        marginTop: '15px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px'
      }}>
        (Barra espaciadora)
      </div>
      </div>
    </div>
  );
  
  // Renderizar en el body usando createPortal
  return createPortal(overlayElement, document.body);
}

export default CrashOverlay;