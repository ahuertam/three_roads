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
      if (transform && transform.position[2] > playerTransform.position[2] + 100) {
        obstacle.destroy();
      }
    });
  }
  
  // Nuevo método para spawn adaptativo
  spawnAdaptivePattern() {
    const { score } = this.gameStore;
    const difficulty = this.getDifficultyByScore(score);
    const pattern = getRandomPattern(difficulty);
    
    if (pattern) {
      this.spawnPatternData(pattern.obstacles, pattern.name);
    } else {
      this.spawnPattern();
    }
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