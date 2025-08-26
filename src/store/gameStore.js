import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  shipPosition: [0, 0.5, -50],
  setShipPosition: (position) => set({ shipPosition: position }),
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
    onPlatform: false,
    platformHeight: 0,
    crashPosition: null
  }),
  
  resetToMenu: () => set({ gameState: 'menu' })
}));

export default useGameStore;