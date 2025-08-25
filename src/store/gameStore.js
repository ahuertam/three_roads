import { create } from 'zustand';

const useGameStore = create((set) => ({
  shipPosition: [0, 0.5, -50], // Cambiar a z: -50 para estar sobre el primer plano
  setShipPosition: (position) => set({ shipPosition: position }),
  gameState: 'playing',
  score: 0,
  lives: 3,
  level: 1,
  speed: 1,
  
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
    shipPosition: [0, 0.5, -50] // Resetear posición al iniciar
  }),
  resetToMenu: () => set({ gameState: 'menu' })
}));

export default useGameStore;