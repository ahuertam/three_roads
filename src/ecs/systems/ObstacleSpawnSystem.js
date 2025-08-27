import { Transform } from '../components/Transform.js';
import { Collision } from '../components/Collision.js';

export class ObstacleSpawnSystem {
  constructor(ecsManager, gameStore) {
    this.ecsManager = ecsManager;
    this.gameStore = gameStore;
    this.spawnTimer = 0;
    this.patternIndex = 0;
    this.nextObstacleId = 0;
    this.lastSpawnZ = 0;
    
    // Tipos de plataformas según SkyRoads
    this.platformTypes = {
      NORMAL: { color: '#666666', effect: 'none' },
      SUPPLIES: { color: '#87CEEB', effect: 'supplies' }, // Azul claro
      BOOST: { color: '#32CD32', effect: 'boost' },       // Verde
      STICKY: { color: '#90EE90', effect: 'sticky' },     // Verde claro
      SLIPPERY: { color: '#FFA500', effect: 'slippery' }, // Naranja
      BURNING: { color: '#FF6347', effect: 'burning' }    // Rojo/naranja
    };
    
    // Patrones más continuos con tipos de plataforma
    this.obstaclePatterns = [
      // Patrón 1: Túnel con plataformas especiales
      [
        { x: -25, y: 1, z: 0, size: [8, 4, 30], type: 'NORMAL' },
        { x: 25, y: 1, z: 0, size: [8, 4, 30], type: 'NORMAL' },
        { x: 0, y: 6, z: 0, size: [50, 4, 30], type: 'NORMAL' },
        { x: -10, y: 1, z: -40, size: [15, 3, 20], type: 'BOOST' },
        { x: 15, y: 2, z: -70, size: [12, 3, 25], type: 'SUPPLIES' }
      ],
      
      // Patrón 2: Pista con efectos variados
      [
        { x: -20, y: 1, z: 0, size: [12, 2, 25], type: 'STICKY' },
        { x: -5, y: 1.5, z: -30, size: [15, 2, 25], type: 'NORMAL' },
        { x: 10, y: 2, z: -60, size: [18, 2, 25], type: 'SLIPPERY' },
        { x: 20, y: 1.5, z: -90, size: [12, 2, 25], type: 'BOOST' },
        { x: 0, y: 1, z: -120, size: [20, 2, 25], type: 'BURNING' }
      ],
      
      // Patrón 3: Escalones con desafíos
      [
        { x: -15, y: 1, z: 0, size: [12, 2, 20], type: 'NORMAL' },
        { x: -8, y: 2, z: -25, size: [12, 2, 20], type: 'SUPPLIES' },
        { x: 0, y: 3, z: -50, size: [12, 2, 20], type: 'BOOST' },
        { x: 8, y: 4, z: -75, size: [12, 2, 20], type: 'STICKY' },
        { x: 15, y: 3, z: -100, size: [12, 2, 20], type: 'SLIPPERY' },
        { x: 8, y: 2, z: -125, size: [12, 2, 20], type: 'BURNING' },
        { x: 0, y: 1, z: -150, size: [12, 2, 20], type: 'NORMAL' }
      ],
      
      // Patrón 4: Anillos con plataformas especiales
      [
        { x: -20, y: 3, z: 0, size: [6, 8, 15], type: 'NORMAL' },
        { x: 20, y: 3, z: 0, size: [6, 8, 15], type: 'NORMAL' },
        { x: 0, y: 7, z: 0, size: [40, 4, 15], type: 'NORMAL' },
        { x: -15, y: 2, z: -40, size: [8, 6, 15], type: 'BOOST' },
        { x: 15, y: 2, z: -40, size: [8, 6, 15], type: 'SUPPLIES' },
        { x: 0, y: 5, z: -40, size: [30, 4, 15], type: 'SLIPPERY' },
        { x: 0, y: 1, z: -80, size: [25, 2, 20], type: 'BURNING' }
      ],
      
      // Patrón 5: Laberinto de efectos
      [
        { x: -18, y: 1, z: 0, size: [10, 2, 18], type: 'STICKY' },
        { x: 0, y: 2, z: -20, size: [8, 2, 18], type: 'BOOST' },
        { x: 18, y: 1, z: -40, size: [10, 2, 18], type: 'SUPPLIES' },
        { x: -12, y: 3, z: -60, size: [12, 2, 18], type: 'SLIPPERY' },
        { x: 12, y: 2, z: -80, size: [12, 2, 18], type: 'BURNING' },
        { x: 0, y: 1, z: -100, size: [16, 2, 18], type: 'NORMAL' },
        { x: -8, y: 2, z: -120, size: [10, 2, 18], type: 'BOOST' },
        { x: 8, y: 3, z: -140, size: [10, 2, 18], type: 'SUPPLIES' }
      ]
    ];
  }
  
  update(delta) {
    const { gameTime, gameState } = this.gameStore;
    
    // Solo generar si el juego está activo
    if (gameState !== 'playing') return;
    
    this.spawnTimer += delta;
    
    // Generar obstáculos cada 3 segundos para mayor continuidad
    if (this.spawnTimer > 3) {
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
}