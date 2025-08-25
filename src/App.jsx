import React from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './components/Game';
import './App.css';

function App() {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{
          position: [0, 8, 12],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        <Game />
      </Canvas>
    </div>
  );
}

export default App;
