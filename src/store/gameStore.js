import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  shipPosition: [0, 0.5, -50],
  setShipPosition: (position) => set({ shipPosition: position }),
  gameState: 'playing',
  score: 0,
  lives: 3,
  level: 1,
  speed: 1,
  gameTime: 0,
  onPlatform: false,
  platformHeight: 0,
  
  updateGameTime: (deltaTime) => set((state) => ({ 
    gameTime: state.gameTime + deltaTime 
  })),
  updateScore: (points) => set((state) => ({ score: state.score + points })),
  increaseSpeed: () => set((state) => ({ speed: Math.min(state.speed + 0.1, 3) })),
  handleCollision: () => set((state) => ({ 
    lives: state.lives - 1,
    gameState: state.lives <= 1 ? 'gameOver' : 'playing'
  })),
  startGame: () => set({ 
    gameState: 'playing', 
    score: 0, 
    lives: 3, 
    level: 1, 
    speed: 1,
    gameTime: 0,
    shipPosition: [0, 0.5, -50],
    onPlatform: false,
    platformHeight: 0
  }),
  resetToMenu: () => set({ gameState: 'menu' })
}));

export default useGameStore;