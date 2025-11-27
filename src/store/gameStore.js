import { create } from 'zustand';

import { LEVELS } from '../levels/index.js';

const useGameStore = create((set, get) => ({
  shipPosition: [0, 2, -50], // Subir un poco para asegurar caída limpia sobre la plataforma
  initialZ: -50, // Posición Z inicial para calcular distancia
  distanceTraveled: 0, // Nueva propiedad para metros recorridos
  highScores: (() => {
    try {
      const v = localStorage.getItem('three_roads_highScores');
      return v ? JSON.parse(v) : {};
    } catch {
      return {};
    }
  })(),
  justLoadedLevel: false, // Flag para evitar condiciones de carrera en el reset
  resetLevelGeneration: false, // Flag para forzar regeneración de nivel (fix flickering)
  setShipPosition: (position) => {
    const state = get();
    
    // Si acabamos de cargar nivel, ignorar la primera actualización de posición
    // que viene del frame anterior para evitar que la nave vuelva a la posición vieja
    if (state.justLoadedLevel) {
      console.log('GameStore: Ignoring stale position update after level load');
      set({ justLoadedLevel: false });
      return;
    }
    
    // Solo actualizar posición y distancia si el juego está en estado 'playing'
    if (state.gameState !== 'playing') {
      return;
    }
    
    // Calcular distancia recorrida basada en movimiento en Z
    const distanceFromStart = Math.abs(position[2] - state.initialZ);
    set({ 
      shipPosition: position,
      distanceTraveled: Math.floor(distanceFromStart)
    });
  },
  gameState: 'menu', // 'playing', 'crashed', 'gameOver', 'menu', 'victory', 'levelComplete'
  score: 0,
  lives: 3,
  levelIndex: 0, // Índice del nivel actual en el array LEVELS
  currentLevel: LEVELS[0],
  speed: 1,
  gameTime: 0,
  onPlatform: false,
  platformHeight: 0,
  crashPosition: null, // Posición donde ocurrió la colisión
  updateHighScore: (levelId, score) => {
    const state = get();
    const currentHigh = state.highScores[levelId] || 0;
    if (score > currentHigh) {
      const newHighScores = { ...state.highScores, [levelId]: score };
      try {
        localStorage.setItem('three_roads_highScores', JSON.stringify(newHighScores));
      } catch {}
      set({ highScores: newHighScores });
    }
  },
  
  updateGameTime: (deltaTime) => {
    const state = get();
    if (state.gameState === 'playing') {
      set({ gameTime: state.gameTime + deltaTime });
    }
  },
  updateScore: (points) => set((state) => ({ score: state.score + points })),
  increaseSpeed: () => set((state) => ({ speed: Math.min(state.speed + 0.1, 3) })),
  
  handleCollision: (position) => {
    const state = get();
    const currentLevelId = state.currentLevel?.id || 'unknown';
    const currentHigh = state.highScores[currentLevelId] || 0;
    
    if (state.distanceTraveled > currentHigh) {
      const newHighScores = { ...state.highScores, [currentLevelId]: state.distanceTraveled };
      try {
        localStorage.setItem('three_roads_highScores', JSON.stringify(newHighScores));
      } catch {}
      set({ highScores: newHighScores });
    }

    set({ 
      lives: state.lives - 1,
      gameState: 'crashed',
      crashPosition: position
    });
  },
  
  continueAfterCrash: () => {
    const state = get();
    if (state.lives > 0) {
      set({
        gameState: 'playing',
        shipPosition: [0, 2, -50],
        initialZ: -50,
        distanceTraveled: 0,
        crashPosition: null,
        resetLevelGeneration: true, // Señal para ObstacleSpawnSystem
        justLoadedLevel: true // Proteger contra actualizaciones de posición obsoletas
      });
    } else {
      set({ gameState: 'gameOver' });
    }
  },
  
  nextLevel: () => {
    const state = get();
    
    // GUARDAR HIGH SCORE DEL NIVEL ACTUAL antes de cambiar
    const currentLevelId = state.currentLevel?.id || 'unknown';
    const currentHigh = state.highScores[currentLevelId] || 0;
    
    if (state.distanceTraveled > currentHigh) {
      const newHighScores = { ...state.highScores, [currentLevelId]: state.distanceTraveled };
      try {
        localStorage.setItem('three_roads_highScores', JSON.stringify(newHighScores));
      } catch {}
      set({ highScores: newHighScores });
    }
    
    const nextIndex = state.levelIndex + 1;
    
    if (nextIndex < LEVELS.length) {
      // Cargar siguiente nivel
      set({
        levelIndex: nextIndex,
        currentLevel: LEVELS[nextIndex],
        gameState: 'playing',
        shipPosition: [0, 2, -50], // Reiniciar posición
        initialZ: -50,
        distanceTraveled: 0,
        crashPosition: null,
        justLoadedLevel: true // Activar flag para proteger la posición
        // Mantener score y vidas
      });
      // Importante: El ObstacleSpawnSystem detectará el cambio de nivel y reiniciará
    } else {
      // Victoria final
      set({ gameState: 'victory' });
    }
  },
  
  restartGame: () => {
    window.location.reload();
  },
  
  startGame: () => set({ 
    gameState: 'playing', 
    score: 0, 
    lives: 3, 
    levelIndex: 0,
    currentLevel: LEVELS[0],
    speed: 1,
    gameTime: 0,
    shipPosition: [0, 2, -50],
    initialZ: -50,
    distanceTraveled: 0,
    onPlatform: false,
    platformHeight: 0,
    crashPosition: null
  }),
  
  startLevel: (index) => {
    const i = Math.max(0, Math.min(index ?? 0, LEVELS.length - 1));
    set({
      gameState: 'playing',
      score: 0,
      lives: 3,
      levelIndex: i,
      currentLevel: LEVELS[i],
      speed: 1,
      gameTime: 0,
      shipPosition: [0, 2, -50],
      initialZ: -50,
      distanceTraveled: 0,
      onPlatform: false,
      platformHeight: 0,
      crashPosition: null,
      justLoadedLevel: true
    });
  },
  
  resetToMenu: () => set({ gameState: 'menu' }),
  supplies: 100,
  currentEffect: 'none',
  
  // Add methods to update platform effects
  setSupplies: (supplies) => set({ supplies }),
  setCurrentEffect: (effect) => set({ currentEffect: effect }),
  setGameState: (state) => set({ gameState: state }),
  setResetLevelGeneration: (value) => set({ resetLevelGeneration: value }),
}));

export default useGameStore;