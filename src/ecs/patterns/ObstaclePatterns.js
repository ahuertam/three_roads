// Definición de tipos de plataforma
export const PLATFORM_TYPES = {
  NORMAL: { color: '#666666', effect: 'none', name: 'Normal' },
  SUPPLIES: { color: '#87CEEB', effect: 'supplies', name: 'Suministros' },
  BOOST: { color: '#32CD32', effect: 'boost', name: 'Impulso' },
  STICKY: { color: '#90EE90', effect: 'sticky', name: 'Pegajoso' },
  SLIPPERY: { color: '#FFA500', effect: 'slippery', name: 'Resbaladizo' },
  BURNING: { color: '#FF6347', effect: 'burning', name: 'Ardiente' },
  GOAL: { color: '#FFD700', effect: 'goal', name: 'Meta' }, // Dorado
  BLOCK: { color: '#8B4513', effect: 'none', name: 'Bloque' } // Marrón
};

// Plantillas de obstáculos reutilizables
export const OBSTACLE_TEMPLATES = {
  // Obstáculos básicos
  WALL_LEFT: { x: -25, y: 1, size: [8, 4, 30], type: 'NORMAL' },
  WALL_RIGHT: { x: 25, y: 1, size: [8, 4, 30], type: 'NORMAL' },
  CEILING: { x: 0, y: 6, size: [50, 4, 30], type: 'NORMAL' },
  
  // Plataformas estándar
  PLATFORM_SMALL: { size: [12, 2, 20], type: 'NORMAL' },
  PLATFORM_MEDIUM: { size: [15, 2, 25], type: 'NORMAL' },
  PLATFORM_LARGE: { size: [20, 2, 30], type: 'NORMAL' },
  
  // Elementos especiales
  BOOST_PAD: { size: [10, 1, 15], type: 'BOOST' },
  SUPPLY_STATION: { size: [8, 2, 12], type: 'SUPPLIES' },
  DANGER_ZONE: { size: [15, 1, 20], type: 'BURNING' },
  GOAL_LINE: { size: [40, 2, 50], type: 'GOAL' },
  BLOCK: { size: [10, 8, 10], type: 'BLOCK' } // Obstáculo alto
};

// Función helper para crear obstáculos desde plantillas
export function createObstacle(template, position, overrides = {}) {
  return {
    x: position.x || 0,
    y: position.y || 1,
    z: position.z || 0,
    size: template.size,
    type: template.type,
    ...overrides
  };
}

export const PATTERN_LIBRARY = {
  // === SEGMENTOS FÁCILES ===
  EASY: {
    'straight_road': {
      name: 'Recta Simple',
      difficulty: 'easy',
      description: 'Camino recto básico',
      // Ajustado: -120 coincide con la longitud de la plataforma (120)
      exitPoint: { x: 0, y: 0, z: -120 },
      obstacles: [
        // Suelo en Y=-1. Centro en Z=-60, longitud 120. Abarca de 0 a -220.
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -60, size: [20, 2, 220] })
      ]
    },
    
    'gentle_climb': {
      name: 'Subida Suave',
      difficulty: 'easy', 
      description: 'Pequeña elevación',
      // Ajustado: -120 coincide con 2 plataformas de 60
      exitPoint: { x: 0, y: 2, z: -120 },
      obstacles: [
        // 0 a -60
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -30, size: [20, 2, 60] }),
        // -60 a -120 (sube 1u -> Y=0, superficie en 1)
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: 0, z: -90, size: [20, 2, 60] }) 
      ]
    },
    
    'small_gap': {
      name: 'Pequeño Salto',
      difficulty: 'easy',
      description: 'Brecha fácil de saltar',
      // Ajustado: -140 -> 50 (plat) + 20 (gap) + 70 (plat) = 140
      exitPoint: { x: 0, y: 0, z: -140 },
      obstacles: [
        // 0 a -50
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -25, size: [20, 2, 50] }),
        // Gap de -50 a -70 (20u)
        // -70 a -140 (70u)
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -105, size: [20, 2, 70] })
      ]
    }
  },
  
  // === SEGMENTOS MEDIOS ===
  MEDIUM: {
    'split_path': {
      name: 'Camino Dividido',
      difficulty: 'medium',
      description: 'Dos caminos paralelos',
      exitPoint: { x: 0, y: 0, z: -120 },
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -15, y: -1, z: -60, size: [15, 2, 120] }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: 15, y: -1, z: -60, size: [15, 2, 120] })
      ]
    },
    
    'step_sequence': {
      name: 'Escaleras',
      difficulty: 'medium',
      description: 'Serie de escalones',
      // 3 escalones de 40u = 120u
      exitPoint: { x: 0, y: 4, z: -120 },
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -20, size: [20, 2, 40] }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: 1, z: -60, size: [20, 2, 40] }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: 3, z: -100, size: [20, 2, 40] })
      ]
    },
    
    'hazard_road': {
      name: 'Camino Peligroso',
      difficulty: 'medium',
      description: 'Plataformas con zonas peligrosas',
      // 3 plataformas de 40u = 120u
      exitPoint: { x: 0, y: 0, z: -120 },
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -20, size: [20, 2, 40] }),
        createObstacle(OBSTACLE_TEMPLATES.DANGER_ZONE, { x: 0, y: 0.1, z: -60, size: [20, 1, 40] }), 
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -60, size: [20, 2, 40] }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -100, size: [20, 2, 40] })
      ]
    }
  },
  
  // === SEGMENTOS DIFÍCILES ===
  HARD: {
    'island_hops': {
      name: 'Islas Flotantes',
      difficulty: 'hard',
      description: 'Saltos precisos entre islas',
      // Ajuste de coordenadas para evitar gaps no intencionados
      exitPoint: { x: 0, y: 0, z: -160 },
      obstacles: [
        // 0 a -30
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 0, y: -1, z: -15, size: [12, 2, 30] }),
        // Gap 20u (-30 a -50)
        // -50 a -80
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: -15, y: 1, z: -65, size: [12, 2, 30] }),
        // Gap 20u (-80 a -100)
        // -100 a -130
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 15, y: 3, z: -115, size: [12, 2, 30] }),
        // Gap 10u (-130 a -140)
        // -140 a -150 (Landing pad)
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 0, y: 1, z: -145, size: [12, 2, 10] }) 
      ]
    },
    
    'narrow_bridge': {
      name: 'Puente Estrecho',
      difficulty: 'hard',
      description: 'Camino muy delgado',
      // 20 + 80 + 20 = 120
      exitPoint: { x: 0, y: 0, z: -120 },
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -10, size: [20, 2, 20] }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 0, y: -1, z: -60, size: [4, 2, 80] }), 
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -110, size: [20, 2, 20] })
      ]
    },

    'block_field': {
      name: 'Campo de Bloques',
      difficulty: 'hard',
      description: 'Obstáculos altos para esquivar',
      exitPoint: { x: 0, y: 0, z: -100 },
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -50, size: [20, 2, 100] }),
        // Bloques altos que obligan a moverse lateralmente
        createObstacle(OBSTACLE_TEMPLATES.BLOCK, { x: -5, y: 4, z: -30 }),
        createObstacle(OBSTACLE_TEMPLATES.BLOCK, { x: 5, y: 4, z: -60 }),
        createObstacle(OBSTACLE_TEMPLATES.BLOCK, { x: 0, y: 4, z: -90 })
      ]
    }
  }
};

// Función para obtener patrones por dificultad
export function getPatternsByDifficulty(difficulty) {
  return PATTERN_LIBRARY[difficulty.toUpperCase()] || {};
}

// Función para obtener un patrón aleatorio de una dificultad
export function getRandomPattern(difficulty = 'MEDIUM') {
  const patterns = getPatternsByDifficulty(difficulty);
  const patternKeys = Object.keys(patterns);
  if (patternKeys.length === 0) return null;
  
  const randomKey = patternKeys[Math.floor(Math.random() * patternKeys.length)];
  return patterns[randomKey];
}

// Función para obtener todos los patrones como array (para compatibilidad)
export function getAllPatternsAsArray() {
  const allPatterns = [];
  
  Object.values(PATTERN_LIBRARY).forEach(difficultyGroup => {
    Object.values(difficultyGroup).forEach(pattern => {
      allPatterns.push(pattern.obstacles);
    });
  });
  
  return allPatterns;
}