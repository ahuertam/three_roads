import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  shipPosition: [0, 2, -50], // Subir un poco para asegurar caída limpia sobre la plataforma
  initialZ: -50, // Posición Z inicial para calcular distancia
  distanceTraveled: 0, // Nueva propiedad para metros recorridos
  setShipPosition: (position) => {
    const state = get();
    // Calcular distancia recorrida basada en movimiento en Z
    const distanceFromStart = Math.abs(position[2] - state.initialZ);
    set({ 
      shipPosition: position,
      distanceTraveled: Math.floor(distanceFromStart)
    });
  },
  gameState: 'playing', // 'playing', 'crashed', 'gameOver', 'menu'
  score: 0,
  lives: 3,
  level: 1,
  speed: 1,
  gameTime: 0,
  onPlatform: false,
  platformHeight: 0,
  crashPosition: null, // Posición donde ocurrió la colisión
  
  updateGameTime: (deltaTime) => {
    const state = get();
    if (state.gameState === 'playing') {
      set({ gameTime: state.gameTime + deltaTime });
    }
  },
  updateScore: (points) => set((state) => ({ score: state.score + points })),
  increaseSpeed: () => set((state) => ({ speed: Math.min(state.speed + 0.1, 3) })),
  
  handleCollision: (position) => set((state) => ({ 
    lives: state.lives - 1,
    gameState: 'crashed',
    crashPosition: position
  })),
  
  continueAfterCrash: () => {
    const state = get();
    if (state.lives > 0) {
      set({ 
        gameState: 'playing',
        shipPosition: [0, 0.5, -50],
        crashPosition: null
      });
    } else {
      set({ gameState: 'gameOver' });
    }
  },
  
  restartGame: () => {
    window.location.reload();
  },
  
  startGame: () => set({ 
    gameState: 'playing', 
    score: 0, 
    lives: 3, 
    level: 1, 
    speed: 1,
    gameTime: 0,
    shipPosition: [0, 0.5, -50],
    initialZ: -50,
    distanceTraveled: 0,
    onPlatform: false,
    platformHeight: 0,
    crashPosition: null
  }),
  
  resetToMenu: () => set({ gameState: 'menu' }),
  supplies: 100,
  currentEffect: 'none',
  
  // Add methods to update platform effects
  setSupplies: (supplies) => set({ supplies }),
  setCurrentEffect: (effect) => set({ currentEffect: effect }),
  setGameState: (state) => set({ gameState: state }),
}));

export default useGameStore;