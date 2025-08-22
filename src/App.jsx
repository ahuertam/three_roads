import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        shadows
      >
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} castShadow />
        <Game />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

export default App;
