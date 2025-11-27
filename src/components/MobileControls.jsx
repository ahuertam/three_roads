import React, { useEffect, useRef, useState } from 'react';
import useGameStore from '../store/gameStore';

function MobileControls({ inputSystem }) {
  const gameState = useGameStore(s => s.gameState);
  const [isMobile, setIsMobile] = useState(false);
  const joystickRef = useRef(null);
  const jumpButtonRef = useRef(null);
  const activeTouch = useRef({ joystick: null, jump: null });

  useEffect(() => {
    // Detectar si es un dispositivo móvil o táctil
    const checkMobile = () => {
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(hasTouchScreen || isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !inputSystem || gameState !== 'playing') return;

    const handleJoystickTouch = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) {
        // Touch ended
        inputSystem.setMobileInput({ left: false, right: false, forward: false, backward: false });
        activeTouch.current.joystick = null;
        return;
      }

      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      
      const threshold = 20; // Umbral mínimo para activar el movimiento
      
      inputSystem.setMobileInput({
        left: deltaX < -threshold,
        right: deltaX > threshold,
        forward: deltaY < -threshold,
        backward: deltaY > threshold
      });
      
      activeTouch.current.joystick = touch.identifier;
    };

    const handleJumpTouch = (e) => {
      e.preventDefault();
      const isPressed = e.type === 'touchstart';
      inputSystem.setMobileInput({ jump: isPressed });
      
      if (isPressed) {
        activeTouch.current.jump = e.touches[0]?.identifier;
      } else {
        activeTouch.current.jump = null;
      }
    };

    const joystick = joystickRef.current;
    const jumpButton = jumpButtonRef.current;

    if (joystick) {
      joystick.addEventListener('touchstart', handleJoystickTouch);
      joystick.addEventListener('touchmove', handleJoystickTouch);
      joystick.addEventListener('touchend', handleJoystickTouch);
    }

    if (jumpButton) {
      jumpButton.addEventListener('touchstart', handleJumpTouch);
      jumpButton.addEventListener('touchend', handleJumpTouch);
    }

    return () => {
      if (joystick) {
        joystick.removeEventListener('touchstart', handleJoystickTouch);
        joystick.removeEventListener('touchmove', handleJoystickTouch);
        joystick.removeEventListener('touchend', handleJoystickTouch);
      }
      if (jumpButton) {
        jumpButton.removeEventListener('touchstart', handleJumpTouch);
        jumpButton.removeEventListener('touchend', handleJumpTouch);
      }
    };
  }, [isMobile, inputSystem, gameState]);

  if (!isMobile || gameState !== 'playing') return null;

  return (
    <>
      {/* Joystick Virtual */}
      <div
        ref={joystickRef}
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: '3px solid #00ff00',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          userSelect: 'none'
        }}
      >
        {/* Centro del joystick */}
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 255, 0, 0.3)',
          border: '2px solid #00ff00',
          pointerEvents: 'none'
        }} />
        
        {/* Indicadores direccionales */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#00ff00',
          fontSize: '20px',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>▲</div>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#00ff00',
          fontSize: '20px',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>▼</div>
        <div style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#00ff00',
          fontSize: '20px',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>◀</div>
        <div style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#00ff00',
          fontSize: '20px',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>▶</div>
      </div>

      {/* Botón de Salto */}
      <div
        ref={jumpButtonRef}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: '3px solid #32CD32',
          boxShadow: '0 0 20px rgba(50, 205, 50, 0.4)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          userSelect: 'none',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#32CD32',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Salto
      </div>
    </>
  );
}

export default MobileControls;
