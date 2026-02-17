import { create } from 'zustand';

import { LEVELS } from '../levels/index.js';

const getPreviewLevel = () => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const previewKey = params.get('previewKey');
  if (previewKey) {
    try {
      const stored = localStorage.getItem(previewKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.segments) {
          return { level: parsed, isPreview: true };
        }
      }
    } catch {}
  }
  const previewData = params.get('previewLevelData');
  if (!previewData) return null;
  try {
    const parsed = JSON.parse(previewData);
    if (!parsed || !parsed.segments) return null;
    return { level: parsed, isPreview: true };
  } catch {
    return null;
  }
};

const previewLevelInfo = getPreviewLevel();
const previewLevel = previewLevelInfo?.level ?? null;
const isPreview = Boolean(previewLevelInfo?.isPreview);

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
  bestTimes: (() => {
    try {
      const v = localStorage.getItem('three_roads_bestTimes');
      return v ? JSON.parse(v) : {};
    } catch {
      return {};
    }
  })(),
  levelTime: 0, // Tiempo del nivel actual en segundos
  justLoadedLevel: previewLevel ? true : false, // Flag para evitar condiciones de carrera en el reset
  resetLevelGeneration: false, // Flag para forzar regeneración de nivel (fix flickering)
  gameState: previewLevel ? 'playing' : 'menu',
  levelIndex: 0,
  currentLevel: previewLevel || LEVELS[0],
  isPreview,
  previewPayloadHash: null,
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
  score: 0,
  lives: 3,
  speed: 1,
  gameTime: 0,
  onPlatform: false,
  platformHeight: 0,
  crashPosition: null,
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
      set({ 
        gameTime: state.gameTime + deltaTime,
        levelTime: state.levelTime + deltaTime
      });
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
    
    if (state.isPreview) {
      set({
        gameState: 'playing',
        shipPosition: [0, 2, -50],
        initialZ: -50,
        distanceTraveled: 0,
        crashPosition: null,
        resetLevelGeneration: true,
        justLoadedLevel: true,
        supplies: 100,
        levelTime: 0
      });
      return;
    }
    
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
    
    // GUARDAR MEJOR TIEMPO DEL NIVEL ACTUAL
    const currentBestTime = state.bestTimes[currentLevelId];
    if (!currentBestTime || state.levelTime < currentBestTime) {
      const newBestTimes = { ...state.bestTimes, [currentLevelId]: state.levelTime };
      try {
        localStorage.setItem('three_roads_bestTimes', JSON.stringify(newBestTimes));
      } catch {}
      set({ bestTimes: newBestTimes });
      console.log(`New best time for ${currentLevelId}: ${state.levelTime.toFixed(2)}s`);
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
        justLoadedLevel: true, // Activar flag para proteger la posición
        supplies: 100, // Resetear suministros al 100%
        levelTime: 0 // Resetear cronómetro del nivel
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
  speed: 1,
    gameTime: 0,
    levelTime: 0, // Resetear cronómetro del nivel
    shipPosition: [0, 2, -50],
    initialZ: -50,
    distanceTraveled: 0,
    onPlatform: false,
    platformHeight: 0,
    crashPosition: null,
  justLoadedLevel: previewLevel ? true : false,
  supplies: 100 // Resetear suministros al 100%
  }),
  
  setPreviewLevel: (levelData, payloadHash) => {
    if (!levelData || !levelData.segments) return;
    const state = get();
    if (payloadHash && state.previewPayloadHash === payloadHash) {
      return;
    }
    set({
      gameState: 'playing',
      score: 0,
      lives: 3,
      levelIndex: 0,
      currentLevel: levelData,
      speed: 1,
      gameTime: 0,
      levelTime: 0,
      shipPosition: [0, 2, -50],
      initialZ: -50,
      distanceTraveled: 0,
      onPlatform: false,
      platformHeight: 0,
      crashPosition: null,
      justLoadedLevel: true,
      resetLevelGeneration: true,
      supplies: 100,
      isPreview: true,
      previewPayloadHash: payloadHash || null
    });
  },
  
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
      levelTime: 0, // Resetear cronómetro del nivel
      shipPosition: [0, 2, -50],
      initialZ: -50,
      distanceTraveled: 0,
      onPlatform: false,
      platformHeight: 0,
      crashPosition: null,
      justLoadedLevel: true,
      supplies: 100 // Resetear suministros al 100%
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
