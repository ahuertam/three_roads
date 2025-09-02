import { Transform } from '../components/Transform.js';
import { Collision } from '../components/Collision.js';
import { 
  PLATFORM_TYPES, 
  PATTERN_LIBRARY, 
  getRandomPattern, 
  getAllPatternsAsArray 
} from '../patterns/ObstaclePatterns.js';

export class ObstacleSpawnSystem {
  constructor(ecsManager, gameStore) {
    this.ecsManager = ecsManager;
    this.gameStore = gameStore;
    this.spawnTimer = 0;
    this.patternIndex = 0;
    this.nextObstacleId = 0;
    this.lastSpawnZ = 0;
    
    // Contador para plataformas de suministros
    this.patternsWithoutSupplies = 0;
    this.maxPatternsWithoutSupplies = 2; // Cada 2 patrones máximo
    
    // Mejorado: Espaciado mínimo entre patrones
    this.minPatternSpacing = 140; // Aumentado para evitar superposiciones
    this.currentPatternLength = 0;
    
    // Configuración de dificultad adaptativa
    this.difficultyConfig = {
      easy: { weight: 0.5, minScore: 0 },
      medium: { weight: 0.3, minScore: 100 },
      hard: { weight: 0.2, minScore: 300 }
    };
    
    // Usar los tipos de plataforma del archivo de patrones
    this.platformTypes = PLATFORM_TYPES;
    
    // Cargar patrones desde el archivo de configuración
    this.obstaclePatterns = getAllPatternsAsArray();
    
    // Modo de spawn: 'sequential' o 'adaptive'
    this.spawnMode = 'adaptive';
  }
  
  update(delta) {
    const { gameTime, gameState } = this.gameStore;
    
    if (gameState !== 'playing') return;
    
    this.spawnTimer += delta;
    
    if (this.spawnTimer > 3) {
      if (this.spawnMode === 'adaptive') {
        this.spawnAdaptivePattern();
      } else {
        this.spawnPattern();
      }
      this.spawnTimer = 0;
    }
    
    this.cleanupOldObstacles();
  }
  
  // Método para cambiar el modo de spawn
  setSpawnMode(mode) {
    this.spawnMode = mode;
  }
  
  spawnPattern() {
    const playerEntities = this.ecsManager.getEntitiesWithTag('player');
    if (playerEntities.length === 0) return;
    
    const playerTransform = playerEntities[0].getComponent(Transform);
    const pattern = this.obstaclePatterns[this.patternIndex % this.obstaclePatterns.length];
    
    const baseZ = playerTransform.position[2] - 120;
    
    pattern.forEach(obstacleData => {
      const obstacle = this.ecsManager.createEntity('obstacle');
      
      obstacle.addComponent(new Transform(
        obstacleData.x,
        obstacleData.y,
        baseZ + obstacleData.z
      ));
      
      obstacle.addComponent(new Collision(
        obstacleData.size[0],
        obstacleData.size[1],
        obstacleData.size[2]
      ));
      
      // Agregar datos adicionales para el renderizado
      obstacle.size = obstacleData.size;
      obstacle.platformType = obstacleData.type || 'NORMAL';
      obstacle.spawnTime = Date.now();
    });
    
    this.lastSpawnZ = baseZ;
    this.patternIndex++;
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
      // Aumentado de 100 a 150 para mayor delay antes de desaparecer
      if (transform && transform.position[2] > playerTransform.position[2] + 150) {
        obstacle.destroy();
      }
    });
  }
  
  // Nuevo método para spawn adaptativo
  spawnAdaptivePattern() {
    const { score } = this.gameStore;
    const difficulty = this.getDifficultyByScore(score);
    let pattern = getRandomPattern(difficulty);
    
    // Forzar plataforma de suministros si han pasado 2 patrones sin una
    if (this.patternsWithoutSupplies >= this.maxPatternsWithoutSupplies) {
      pattern = this.ensureSupplyPlatform(pattern);
      this.patternsWithoutSupplies = 0;
    } else {
      // Verificar si el patrón actual tiene suministros
      const hasSupplies = pattern && pattern.obstacles.some(obs => obs.type === 'SUPPLIES');
      if (hasSupplies) {
        this.patternsWithoutSupplies = 0;
      } else {
        this.patternsWithoutSupplies++;
      }
    }
    
    if (pattern) {
      this.spawnPatternData(pattern.obstacles, pattern.name);
    } else {
      this.spawnPattern();
    }
  }

  // Nuevo método para asegurar plataforma de suministros
  ensureSupplyPlatform(originalPattern) {
    if (!originalPattern) {
      // Crear un patrón simple con suministros
      return {
        name: 'Suministros de Emergencia',
        obstacles: [
          { x: 0, y: 1, z: 0, size: [15, 2, 25], type: 'SUPPLIES' },
          { x: -12, y: 1, z: -40, size: [12, 2, 20], type: 'NORMAL' },
          { x: 12, y: 1, z: -80, size: [12, 2, 20], type: 'NORMAL' }
        ]
      };
    }
    
    // Modificar el patrón existente para incluir suministros
    const modifiedPattern = {
      ...originalPattern,
      name: originalPattern.name + ' + Suministros',
      obstacles: [...originalPattern.obstacles]
    };
    
    // Reemplazar la primera plataforma normal con una de suministros
    const normalPlatformIndex = modifiedPattern.obstacles.findIndex(obs => obs.type === 'NORMAL');
    if (normalPlatformIndex !== -1) {
      modifiedPattern.obstacles[normalPlatformIndex] = {
        ...modifiedPattern.obstacles[normalPlatformIndex],
        type: 'SUPPLIES'
      };
    } else {
      // Si no hay plataformas normales, agregar una de suministros al final
      const lastObstacle = modifiedPattern.obstacles[modifiedPattern.obstacles.length - 1];
      modifiedPattern.obstacles.push({
        x: 0,
        y: 1,
        z: (lastObstacle?.z || 0) - 30,
        size: [12, 2, 20],
        type: 'SUPPLIES'
      });
    }
    
    return modifiedPattern;
  }

  spawnPatternData(patternObstacles, patternName = 'Unknown') {
    const playerEntities = this.ecsManager.getEntitiesWithTag('player');
    if (playerEntities.length === 0) return;
    
    const playerTransform = playerEntities[0].getComponent(Transform);
    
    // Mejorado: Calcular posición base considerando el espaciado mínimo
    const baseZ = Math.min(
      playerTransform.position[2] - 120,
      this.lastSpawnZ - this.minPatternSpacing
    );
    
    // Calcular la longitud del patrón actual
    let patternLength = 0;
    patternObstacles.forEach(obstacleData => {
      const obstacleEndZ = Math.abs(obstacleData.z) + (obstacleData.size[2] / 2);
      patternLength = Math.max(patternLength, obstacleEndZ);
    });
    
    patternObstacles.forEach(obstacleData => {
      const obstacle = this.ecsManager.createEntity('obstacle');
      
      obstacle.addComponent(new Transform(
        obstacleData.x,
        obstacleData.y,
        baseZ + obstacleData.z
      ));
      
      obstacle.addComponent(new Collision(
        obstacleData.size[0],
        obstacleData.size[1],
        obstacleData.size[2]
      ));
      
      obstacle.size = obstacleData.size;
      obstacle.platformType = obstacleData.type || 'NORMAL';
      obstacle.spawnTime = Date.now();
      obstacle.patternName = patternName; // Para debugging
    });
    
    // Actualizar la posición del último spawn
    this.lastSpawnZ = baseZ - patternLength;
    this.currentPatternLength = patternLength;
    
    console.log(`Spawned pattern: ${patternName} at Z: ${baseZ}, Length: ${patternLength}`);
  }
  
  getDifficultyByScore(score) {
    if (score >= 300) return 'hard';
    if (score >= 100) return 'medium';
    return 'easy';
  }
}