import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Estado del juego
  gameState: 'menu', // 'menu', 'playing', 'gameOver'
  score: 0,
  speed: 0.1,
  lives: 3,
  level: 1,
  
  // Estado del jugador
  shipPosition: { x: 0, y: 0.5, z: 0 },
  shipVelocity: { x: 0, y: 0, z: 0 },
  isJumping: false,
  isInvulnerable: false,
  
  // Obstáculos
  obstacles: [],
  nextObstacleId: 0,
  
  // Controles
  keys: {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
  },
  
  // Acciones del juego
  startGame: () => set({ 
    gameState: 'playing', 
    score: 0, 
    lives: 3, 
    level: 1, 
    speed: 0.15, // Velocidad inicial más alta
    obstacles: [],
    shipPosition: { x: 0, y: 0.5, z: 0 },
    shipVelocity: { x: 0, y: 0, z: 0 }
  }),
  
  endGame: () => set({ gameState: 'gameOver' }),
  
  resetToMenu: () => set({ 
    gameState: 'menu',
    obstacles: [],
    shipPosition: { x: 0, y: 0.5, z: 0 },
    shipVelocity: { x: 0, y: 0, z: 0 }
  }),
  
  updateScore: (points) => set((state) => ({ 
    score: state.score + points,
    level: Math.floor((state.score + points) / 1000) + 1
  })),
  
  loseLife: () => set((state) => {
    const newLives = state.lives - 1;
    return {
      lives: newLives,
      isInvulnerable: true,
      gameState: newLives <= 0 ? 'gameOver' : state.gameState
    };
  }),
  
  // Acciones del jugador
  setShipPosition: (position) => set({ shipPosition: position }),
  setShipVelocity: (velocity) => set({ shipVelocity: velocity }),
  setJumping: (jumping) => set({ isJumping: jumping }),
  setInvulnerable: (invulnerable) => set({ isInvulnerable: invulnerable }),
  
  setKey: (key, pressed) => set((state) => ({
    keys: { ...state.keys, [key]: pressed }
  })),
  
  // Aceleración más rápida
  increaseSpeed: () => set((state) => ({ 
    speed: Math.min(state.speed + 0.015, 0.5) // Incremento más grande y velocidad máxima más alta
  })),
  
  // Gestión de obstáculos
  addObstacle: (obstacle) => set((state) => ({
    obstacles: [...state.obstacles, { ...obstacle, id: state.nextObstacleId }],
    nextObstacleId: state.nextObstacleId + 1
  })),
  
  removeObstacle: (id) => set((state) => ({
    obstacles: state.obstacles.filter(obs => obs.id !== id)
  })),
  
  clearObstacles: () => set({ obstacles: [] }),
  
  // Colisión
  handleCollision: () => {
    const state = get();
    if (!state.isInvulnerable) {
      state.loseLife();
      // Hacer invulnerable por 2 segundos
      setTimeout(() => {
        state.setInvulnerable(false);
      }, 2000);
    }
  },
  
  // Verificar si el jugador está sobre un agujero
  checkHoleFall: () => {
    const state = get();
    const shipPos = state.shipPosition;
    
    // Si la nave está en el suelo y en una posición de agujero
    if (shipPos.y <= 0.6) {
      // Lógica para verificar si está sobre un agujero
      // Esto se implementará en el componente Ship
      return true;
    }
    return false;
  }
}));

export default useGameStore;