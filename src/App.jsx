import React from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './components/Game';
import CrashOverlay from './components/CrashOverlay';
import './App.css';

function App() {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 5, 0], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #98FB98)' }}
      >
        <Game />
      </Canvas>
      
      {/* Overlay para el mensaje de crash */}
      <CrashOverlay />
    </div>
  );
}

export default App;
