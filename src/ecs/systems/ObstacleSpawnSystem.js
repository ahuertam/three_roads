import { Transform } from '../components/Transform.js';
import { Collision } from '../components/Collision.js';

export class ObstacleSpawnSystem {
  constructor(ecsManager, gameStore) {
    this.ecsManager = ecsManager;
    this.gameStore = gameStore;
    this.spawnTimer = 0;
    this.patternIndex = 0;
    this.nextObstacleId = 0;
    
    this.obstaclePatterns = [
      // Patrón 1: Escalones ascendentes
      [
        { x: -12, y: 1, z: 0, size: [8, 2, 12] },
        { x: -4, y: 2, z: -15, size: [8, 2, 12] },
        { x: 4, y: 3, z: -30, size: [8, 2, 12] },
        { x: 12, y: 2, z: -45, size: [8, 2, 12] }
      ],
      // Patrón 2: Plataformas en zigzag
      [
        { x: -15, y: 1, z: 0, size: [10, 2, 8] },
        { x: 0, y: 2, z: -20, size: [12, 2, 8] },
        { x: 15, y: 1, z: -40, size: [10, 2, 8] },
        { x: 0, y: 3, z: -60, size: [8, 2, 8] }
      ],
      // Patrón 3: Pista central
      [
        { x: 0, y: 1, z: 0, size: [12, 2, 15] },
        { x: 0, y: 2, z: -20, size: [10, 2, 15] },
        { x: 0, y: 3, z: -40, size: [8, 2, 15] }
      ],
      // Patrón 4: Obstáculos laterales
      [
        { x: -18, y: 1, z: 0, size: [8, 3, 20] },
        { x: 18, y: 1, z: 0, size: [8, 3, 20] },
        { x: 0, y: 3, z: -30, size: [8, 2, 10] }
      ],
      // Patrón 5: Escalones descendentes
      [
        { x: 12, y: 3, z: 0, size: [8, 2, 12] },
        { x: 4, y: 2, z: -15, size: [8, 2, 12] },
        { x: -4, y: 1, z: -30, size: [8, 2, 12] },
        { x: -12, y: 2, z: -45, size: [8, 2, 12] }
      ],
      // Patrón 6: Plataformas amplias
      [
        { x: 0, y: 1, z: 0, size: [20, 2, 10] },
        { x: -10, y: 2, z: -25, size: [15, 2, 10] },
        { x: 10, y: 3, z: -50, size: [15, 2, 10] }
      ]
    ];
  }
  
  update(delta) {
    const { gameTime, gameState } = this.gameStore;
    
    // Solo generar si el juego está activo
    if (gameState !== 'playing') return;
    
    this.spawnTimer += delta;
    
    // Generar obstáculos cada 5 segundos (REMOVIDA la limitación de tiempo)
    if (this.spawnTimer > 5) {
      this.spawnPattern();
      this.spawnTimer = 0;
    }
    
    // Limpiar obstáculos viejos
    this.cleanupOldObstacles();
  }
  
  spawnPattern() {
    const playerEntities = this.ecsManager.getEntitiesWithTag('player');
    if (playerEntities.length === 0) return;
    
    const playerTransform = playerEntities[0].getComponent(Transform);
    const pattern = this.obstaclePatterns[this.patternIndex % this.obstaclePatterns.length];
    const baseZ = playerTransform.position[2] - 80; // Más lejos para dar tiempo
    
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
      obstacle.spawnTime = Date.now();
    });
    
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
}