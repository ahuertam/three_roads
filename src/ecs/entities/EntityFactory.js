import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Collision } from '../components/Collision.js';
import { Input } from '../components/Input.js';
import { Platform } from '../components/Platform.js';

export class EntityFactory {
  static createShip(ecsManager, position = [0, 0.5, -50]) {
    const ship = ecsManager.createEntity('player');
    
    ship.addComponent(new Transform(position[0], position[1], position[2]));
    ship.addComponent(new Physics());
    ship.addComponent(new Collision(3, 0.8, 6));
    ship.addComponent(new Input());
    ship.addComponent(new Platform());
    
    return ship;
  }
  
  static createObstacle(ecsManager, position, size) {
    const obstacle = ecsManager.createEntity('obstacle');
    
    obstacle.addComponent(new Transform(position[0], position[1], position[2]));
    obstacle.addComponent(new Collision(size[0], size[1], size[2]));
    
    // Datos adicionales para renderizado
    obstacle.size = size;
    obstacle.spawnTime = Date.now();
    
    return obstacle;
  }
}