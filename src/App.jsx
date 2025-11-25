import React from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './components/Game';
import CrashOverlay from './components/CrashOverlay';
import LevelSelector from './components/LevelSelector';
import HUD from './components/HUD';
import './App.css';
import { audioSystem } from './ecs/systems/AudioSystem';
import { useEffect, useState } from 'react';

function App() {
  const [musicEnabled, setMusicEnabled] = useState(() => (
    typeof audioSystem.isMusicEnabled === 'function' ? audioSystem.isMusicEnabled() : true
  ));

  useEffect(() => {
    let activated = false;
    const tryPlay = () => {
      if (activated) return;
      activated = true;
      if (audioSystem.isMusicEnabled && audioSystem.isMusicEnabled()) {
        audioSystem.playMusic();
      }
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
    };
    window.addEventListener('pointerdown', tryPlay);
    window.addEventListener('keydown', tryPlay);
    return () => {
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
    };
  }, []);

  const toggleMusic = () => {
    const enabled = audioSystem.toggleMusic();
    setMusicEnabled(enabled);
  };

  return (
    <div className="App" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 5, 0], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #98FB98)' }}
      >
        <Game />
      </Canvas>

      <div style={{
        position: 'fixed',
        top: '10px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#ffffff',
        padding: '8px 12px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        border: '2px solid #FFD700',
        boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>música</span>
        <button onClick={toggleMusic} style={{
          backgroundColor: musicEnabled ? '#32CD32' : '#FF6347',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '6px 10px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          {musicEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <LevelSelector />
      <HUD />
      <CrashOverlay />
    </div>
  );
}

export default App;
