// Definición de tipos de plataforma
export const PLATFORM_TYPES = {
  NORMAL: { color: '#666666', effect: 'none', name: 'Normal' },
  SUPPLIES: { color: '#87CEEB', effect: 'supplies', name: 'Suministros' },
  BOOST: { color: '#32CD32', effect: 'boost', name: 'Impulso' },
  STICKY: { color: '#90EE90', effect: 'sticky', name: 'Pegajoso' },
  SLIPPERY: { color: '#FFA500', effect: 'slippery', name: 'Resbaladizo' },
  BURNING: { color: '#FF6347', effect: 'burning', name: 'Ardiente' }
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
  DANGER_ZONE: { size: [15, 1, 20], type: 'BURNING' }
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

// Nuevos patrones continuos y variados
export const PATTERN_LIBRARY = {
  // === PATRONES FÁCILES ===
  EASY: {
    'flowing_path': {
      name: 'Sendero Fluido',
      difficulty: 'easy',
      description: 'Plataformas conectadas suavemente',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: 1, z: 0 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -12, y: 1, z: -35 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: 8, y: 1, z: -70 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: 1, z: -105 })
      ]
    },
    
    'gentle_waves': {
      name: 'Ondas Suaves',
      difficulty: 'easy', 
      description: 'Movimiento ondulante gradual',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -10, y: 1, z: 0 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: 0, y: 1.5, z: -25 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: 10, y: 2, z: -50 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: 0, y: 1.5, z: -75 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -10, y: 1, z: -100 })
      ]
    },
    
    'stepping_stones': {
      name: 'Piedras de Paso',
      difficulty: 'easy',
      description: 'Secuencia de saltos simples',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -8, y: 1, z: 0 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 8, y: 1, z: -30 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -5, y: 1, z: -60 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 12, y: 1, z: -90 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: 1, z: -120 })
      ]
    }
  },
  
  // === PATRONES MEDIOS ===
  MEDIUM: {
    'zigzag_course': {
      name: 'Curso Zigzag',
      difficulty: 'medium',
      description: 'Movimiento lateral continuo',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -15, y: 1, z: 0 }),
        createObstacle(OBSTACLE_TEMPLATES.BOOST_PAD, { x: 0, y: 1, z: -25 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: 15, y: 2, z: -50 }),
        createObstacle(OBSTACLE_TEMPLATES.SUPPLY_STATION, { x: -8, y: 2, z: -75 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: 8, y: 1, z: -100 })
      ]
    },
    
    'elevation_climb': {
      name: 'Escalada de Elevación',
      difficulty: 'medium',
      description: 'Ascenso gradual con variedad',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: 1, z: 0 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -10, y: 2, z: -30 }, { type: 'STICKY' }),
        createObstacle(OBSTACLE_TEMPLATES.BOOST_PAD, { x: 10, y: 3, z: -60 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -5, y: 4, z: -90 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: 2, z: -120 })
      ]
    },
    
    'power_sequence': {
      name: 'Secuencia de Poder',
      difficulty: 'medium',
      description: 'Combinación de efectos especiales',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.SUPPLY_STATION, { x: -12, y: 1, z: 0 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: 0, y: 1, z: -25 }, { type: 'SLIPPERY' }),
        createObstacle(OBSTACLE_TEMPLATES.BOOST_PAD, { x: 12, y: 1, z: -50 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: -8, y: 2, z: -75 }, { type: 'STICKY' }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: 1, z: -100 })
      ]
    }
  },
  
  // === PATRONES DIFÍCILES ===
  HARD: {
    'precision_spiral': {
      name: 'Espiral de Precisión',
      difficulty: 'hard',
      description: 'Movimiento espiral desafiante',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: -18, y: 1, z: 0 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 0, y: 3, z: -25 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 18, y: 5, z: -50 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 0, y: 3, z: -75 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: -18, y: 1, z: -100 })
      ]
    },
    
    'gauntlet_run': {
      name: 'Carrera de Obstáculos',
      difficulty: 'hard',
      description: 'Múltiples desafíos consecutivos',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.DANGER_ZONE, { x: -15, y: 1, z: 0 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 8, y: 3, z: -20 }, { type: 'SLIPPERY' }),
        createObstacle(OBSTACLE_TEMPLATES.BOOST_PAD, { x: -8, y: 1, z: -45 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 15, y: 4, z: -70 }, { type: 'BURNING' }),
        createObstacle(OBSTACLE_TEMPLATES.SUPPLY_STATION, { x: 0, y: 2, z: -95 })
      ]
    },
    
    'floating_islands': {
      name: 'Islas Flotantes',
      difficulty: 'hard',
      description: 'Saltos de larga distancia',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: -20, y: 2, z: 0 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 0, y: 4, z: -35 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: 20, y: 6, z: -70 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_SMALL, { x: -10, y: 3, z: -105 }),
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_MEDIUM, { x: 0, y: 1, z: -130 })
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