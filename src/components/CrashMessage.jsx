import { Html } from '@react-three/drei';
import { useEffect } from 'react';
import useGameStore from '../store/gameStore';

function CrashMessage() {
  const { gameState, continueAfterCrash, restartGame } = useGameStore();
  
  useEffect(() => {
    if (gameState === 'crashed') {
      const handleKeyPress = (event) => {
        if (event.code === 'Space') {
          event.preventDefault();
          
          // Esperar 1 segundo antes de continuar
          setTimeout(() => {
            continueAfterCrash();
            restartGame(); // Refresca la página
          }, 1000);
        }
      };
      
      window.addEventListener('keydown', handleKeyPress);
      
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [gameState, continueAfterCrash, restartGame]);
  
  if (gameState !== 'crashed') return null;
  
  return (
    <Html center>
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        border: '2px solid #ff4444'
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#ff4444' }}>¡Te has estrellado!</h2>
        <p style={{ margin: '10px 0', fontSize: '18px' }}>Presiona SALTO para continuar</p>
        <div style={{ 
          fontSize: '14px', 
          color: '#ccc',
          marginTop: '10px'
        }}>
          (Espacio)
        </div>
      </div>
    </Html>
  );
}

export default CrashMessage;