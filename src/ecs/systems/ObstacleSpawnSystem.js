import { Transform } from '../components/Transform.js';
import { Collision } from '../components/Collision.js';
import {
  PLATFORM_TYPES,
  PATTERN_LIBRARY,
  getRandomPattern,
  getAllPatternsAsArray,
  OBSTACLE_TEMPLATES,
  createObstacle,
  getPatternsByDifficulty
} from '../patterns/ObstaclePatterns.js';
import { levelLoader } from '../../utils/LevelLoader.js';
import { LEVEL_1 } from '../../levels/level1.js';

export class ObstacleSpawnSystem {
  constructor(ecsManager, gameStore) {
    this.ecsManager = ecsManager;
    this.gameStore = gameStore;
    this.spawnTimer = 0;

    // Punto de conexión para el siguiente segmento
    // Inicialmente en 0,0,0, pero se actualizará con cada segmento generado
    this.nextSegmentStart = { x: 0, y: 0, z: 0 };

    // Distancia de visión para generar nuevos segmentos
    this.spawnDistance = 500;

    // Usar los tipos de plataforma del archivo de patrones
    this.platformTypes = PLATFORM_TYPES;

    // Cargar patrones desde el archivo de configuración
    this.obstaclePatterns = getAllPatternsAsArray();

    // SISTEMA DE NIVELES
    this.currentLevel = LEVEL_1;
    this.currentLevelIndex = 0;
    this.currentSegmentIndex = 0;
    this.processedSegments = levelLoader.parseLevel(this.currentLevel);
    this.isLevelComplete = false;
    this.goalSpawned = false;
  }
  
  update(delta) {
    // Acceder al estado actual
    const state = this.gameStore.getState();
    const { gameState, shipPosition, currentLevel, levelIndex } = state;
    
    if (gameState !== 'playing') return;
    
    // Detectar cambio de nivel
    if (this.currentLevelIndex !== levelIndex) {
      this.loadLevel(currentLevel, levelIndex);
      return; // Esperar al siguiente frame para spawnear
    }
    
    // Generar nuevos segmentos si nos acercamos al final del último
    // La nave se mueve hacia Z negativo, así que verificamos si shipZ está cerca de nextSegmentStart.z
    const distanceToNextSpawn = Math.abs(shipPosition[2] - this.nextSegmentStart.z);
    
    if (distanceToNextSpawn < this.spawnDistance) {
      this.spawnNextLevelSegment();
    }
    
    this.cleanupOldObstacles();
  }
  
  loadLevel(levelData, index) {
    console.log(`Loading Level ${index + 1}: ${levelData.name}`);
    this.currentLevel = levelData;
    this.currentLevelIndex = index;
    this.currentSegmentIndex = 0;
    this.processedSegments = levelLoader.parseLevel(levelData);
    this.isLevelComplete = false;
    this.goalSpawned = false;
    
    // Limpiar obstáculos antiguos
    this.ecsManager.getEntitiesWithTag('obstacle').forEach(obs => obs.destroy());
    
    // Spawnear plataforma inicial para el nuevo nivel
    this.spawnInitialPlatform();
  }
  
  spawnInitialPlatform() {
    // Generar una plataforma inicial segura y larga
    const initialPattern = {
      name: 'Start Platform',
      exitPoint: { x: 0, y: 0, z: -200 },
      obstacles: [
        // La nave aparece en Z=-50.
        // Hacemos la plataforma de 200 de largo.
        // Centro en Z=-100 para que vaya de 0 a -200.
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -100 }, { size: [20, 2, 200] })
      ]
    };
    
    // Resetear el punto de inicio
    this.nextSegmentStart = { x: 0, y: 0, z: 0 };
    
    this.spawnPatternData(initialPattern);
  }
  
  spawnNextLevelSegment() {
    if (this.isLevelComplete) {
      if (!this.goalSpawned) {
        this.spawnGoal();
        this.goalSpawned = true;
      }
      return;
    }
    
    if (this.currentSegmentIndex >= this.processedSegments.length) {
      console.log('Level Segments Complete. Spawning Goal.');
      this.isLevelComplete = true;
      return;
    }
    
    const segmentDef = this.processedSegments[this.currentSegmentIndex];
    let patternToSpawn = null;
    
    if (segmentDef.obstacles) {
      // Es un segmento custom ya procesado (Grid)
      patternToSpawn = segmentDef;
    } else if (segmentDef.type) {
      // Es una referencia a un patrón de la librería
      const allPatterns = {
        ...PATTERN_LIBRARY.EASY,
        ...PATTERN_LIBRARY.MEDIUM,
        ...PATTERN_LIBRARY.HARD
      };
      patternToSpawn = allPatterns[segmentDef.type];
    }
    
    if (patternToSpawn) {
      this.spawnPatternData(patternToSpawn);
      this.currentSegmentIndex++;
    } else {
      console.error(`Pattern type not found: ${segmentDef.type}`);
      this.currentSegmentIndex++;
    }
  }
  
  spawnGoal() {
    const goalPattern = {
      name: 'Level Goal',
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.GOAL_LINE, { x: 0, y: 0.1, z: -20 }) // Un poco después del final
      ]
    };
    
    // Asegurar que haya suelo debajo de la meta
    const platformUnderGoal = {
      name: 'Goal Platform',
      exitPoint: { x: 0, y: 0, z: -50 },
      obstacles: [
        createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -25, size: [20, 2, 50] })
      ]
    };
    
    this.spawnPatternData(platformUnderGoal);
    
    // Spawnear la meta sobre la plataforma
    // Ajustar Z manualmente porque spawnPatternData avanza nextSegmentStart
    // Queremos la meta SOBRE la plataforma que acabamos de poner
    // Retrocedemos el puntero para poner la meta
    this.nextSegmentStart.z += 50; 
    this.spawnPatternData(goalPattern);
  }

  spawnAdaptivePattern() {
    const { score } = this.gameStore.getState();
    const difficulty = this.getDifficultyByScore(score);
    let pattern = getRandomPattern(difficulty);

    if (pattern) {
      this.spawnPatternData(pattern);
    } else {
      // Fallback a una recta simple si no hay patrón
      const fallbackPattern = {
        name: 'Fallback Straight',
        exitPoint: { x: 0, y: 0, z: -50 },
        obstacles: [
          createObstacle(OBSTACLE_TEMPLATES.PLATFORM_LARGE, { x: 0, y: -1, z: -25, size: [20, 2, 50] })
        ]
      };
      this.spawnPatternData(fallbackPattern);
    }
  }

  spawnPatternData(pattern) {
    const startPoint = { ...this.nextSegmentStart };

    pattern.obstacles.forEach(obstacleData => {
      const obstacle = this.ecsManager.createEntity('obstacle');

      // Calcular posición absoluta
      const absoluteX = startPoint.x + obstacleData.x;
      const absoluteY = startPoint.y + obstacleData.y;
      const absoluteZ = startPoint.z + obstacleData.z;

      obstacle.addComponent(new Transform(
        absoluteX,
        absoluteY,
        absoluteZ
      ));

      obstacle.addComponent(new Collision(
        obstacleData.size[0],
        obstacleData.size[1],
        obstacleData.size[2]
      ));

      obstacle.size = obstacleData.size;
      obstacle.platformType = obstacleData.type || 'NORMAL';
      obstacle.spawnTime = Date.now();
      obstacle.patternName = pattern.name;
    });

    // Actualizar el punto de inicio para el SIGUIENTE segmento
    if (pattern.exitPoint) {
      this.nextSegmentStart.x += pattern.exitPoint.x;
      this.nextSegmentStart.y += pattern.exitPoint.y;
      this.nextSegmentStart.z += pattern.exitPoint.z;
    } else {
      this.nextSegmentStart.z -= 50;
    }

    console.log(`Spawned segment: ${pattern.name} at Z: ${startPoint.z}, Next starts at: ${this.nextSegmentStart.z}`);
  }

  cleanupOldObstacles() {
    const playerEntities = this.ecsManager.getEntitiesWithTag('player');
    if (playerEntities.length === 0) return;

    const playerTransform = playerEntities[0].getComponent(Transform);
    const obstacles = this.ecsManager.getEntitiesWithTag('obstacle');

    // Crear una copia del array para evitar problemas de modificación durante iteración
    const obstaclesToCheck = [...obstacles];

    obstaclesToCheck.forEach(obstacle => {
      const transform = obstacle.getComponent(Transform);
      // Eliminar obstáculos que han quedado muy atrás (Z mayor que playerZ + margen)
      // Recordar que vamos hacia Z negativo, así que "atrás" es Z positivo relativo al jugador
      if (transform && transform.position[2] > playerTransform.position[2] + 100) {
        obstacle.destroy();
      }
    });
  }

  getDifficultyByScore(score) {
    if (score >= 300) return 'hard';
    if (score >= 100) return 'medium';
    return 'easy';
  }
}