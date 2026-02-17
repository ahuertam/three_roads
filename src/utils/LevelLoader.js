import { OBSTACLE_TEMPLATES, createObstacle } from '../ecs/patterns/ObstaclePatterns.js';

export class LevelLoader {
  constructor() {
    this.segmentRegistry = {};
  }

  /**
   * Parsea una definición de nivel híbrido (JSON/Objeto)
   * @param {Object} levelData - El objeto del nivel
   * @returns {Array} Lista de segmentos procesados listos para spawnear
   */
  parseLevel(levelData) {
    if (!levelData || !levelData.segments) {
      console.error('Level data invalid:', levelData);
      return [];
    }

    return levelData.segments.map(segmentDef => {
      if (segmentDef.type === 'custom_grid') {
        return this.parseGridSegment(segmentDef);
      } else {
        // Es un segmento predefinido (del PATTERN_LIBRARY)
        // Aquí solo devolvemos la referencia, el sistema lo buscará en la librería
        return segmentDef;
      }
    });
  }

  /**
   * Convierte un grid 2D en un segmento de obstáculos 3D
   * @param {Object} segmentDef - Definición del segmento tipo grid
   * @returns {Object} Objeto de patrón compatible con el sistema de spawn
   */
  parseGridSegment(segmentDef) {
    const { grid, length, name = 'Custom Grid' } = segmentDef;
    const obstacles = [];
    
    // Configuración del grid
    const laneWidth = 15; // Ancho de cada carril
    const defaultLanes = [-laneWidth, 0, laneWidth]; // Posiciones X: Izquierda, Centro, Derecha
    
    // Calcular longitud de cada bloque basado en el largo total y número de filas
    const rows = grid.length;
    const blockLength = length / rows;
    
    // Iterar sobre el grid (filas)
    grid.forEach((row, rowIndex) => {
      // Calcular posición Z (avanzando hacia negativo)
      // El centro del bloque debe estar en:
      // Z_inicio - (rowIndex * blockLength) - (blockLength / 2)
      const zPos = -(rowIndex * blockLength) - (blockLength / 2);
      
      // Iterar sobre las columnas (carriles)
      const columnsCount = Math.min(3, Math.max(1, row.length || defaultLanes.length));
      const lanePositions = columnsCount === 1
        ? [0]
        : columnsCount === 2
          ? [-laneWidth, laneWidth]
          : defaultLanes;
      
      row.forEach((cellValue, colIndex) => {
        const xPos = lanePositions[colIndex];
        if (xPos === undefined) {
          return;
        }
        
        if (cellValue === 1) {
          // 1 = Plataforma normal
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, {
            x: xPos,
            y: -1, // Nivel del suelo
            z: zPos,
            size: [15, 2, blockLength] // Ajustar ancho al carril
          }));
        } else if (cellValue === 2) {
          // 2 = Obstáculo elevado (Muro/Salto)
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, {
            x: xPos,
            y: 1, // Elevado
            z: zPos,
            size: [15, 2, blockLength]
          }));
        } else if (cellValue === 3) {
          // 3 = Peligro (Lava/Fuego)
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.DANGER_ZONE, {
            x: xPos,
            y: 0.1, // Justo encima del suelo (si hubiera)
            z: zPos,
            size: [15, 1, blockLength]
          }));
          // Necesitamos suelo debajo? Depende del diseño. 
          // Si es 3, asumimos que es una plataforma peligrosa, así que añadimos suelo también
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, {
            x: xPos,
            y: -1,
            z: zPos,
            size: [15, 2, blockLength]
          }));
        } else if (cellValue === 4) {
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.SUPPLY_STATION, {
            x: xPos,
            y: 0.1,
            z: zPos,
            size: [15, 2, blockLength]
          }, { type: 'SUPPLIES' }));
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, {
            x: xPos,
            y: -1,
            z: zPos,
            size: [15, 2, blockLength]
          }));
        } else if (cellValue === 5) {
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.BOOST_PAD, {
            x: xPos,
            y: 0.1,
            z: zPos,
            size: [15, 1, blockLength]
          }, { type: 'BOOST' }));
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, {
            x: xPos,
            y: -1,
            z: zPos,
            size: [15, 2, blockLength]
          }));
        } else if (cellValue === 6) {
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, {
            x: xPos,
            y: -1,
            z: zPos,
            size: [15, 2, blockLength]
          }, { type: 'STICKY' }));
        } else if (cellValue === 7) {
          obstacles.push(createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, {
            x: xPos,
            y: -1,
            z: zPos,
            size: [15, 2, blockLength]
          }, { type: 'SLIPPERY' }));
        }
        // 0 = Hueco (No crear nada)
      });
    });

    return {
      name: name,
      difficulty: 'custom',
      exitPoint: { x: 0, y: 0, z: -length },
      obstacles: obstacles
    };
  }
}

export const levelLoader = new LevelLoader();
