import { Input } from '../components/Input.js';

export class InputSystem {
  constructor(ecsManager) {
    this.ecsManager = ecsManager;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const handleKeyDown = (event) => {
      const entities = this.ecsManager.getEntitiesWithTag('player');
      entities.forEach(entity => {
        const input = entity.getComponent(Input);
        if (input) {
          this.updateKeyState(input, event.code, true);
          if (event.code === 'Space') {
            event.preventDefault();
          }
        }
      });
    };
    
    const handleKeyUp = (event) => {
      const entities = this.ecsManager.getEntitiesWithTag('player');
      entities.forEach(entity => {
        const input = entity.getComponent(Input);
        if (input) {
          this.updateKeyState(input, event.code, false);
        }
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Guardar referencias para cleanup
    this.keyDownHandler = handleKeyDown;
    this.keyUpHandler = handleKeyUp;
  }
  
  updateKeyState(input, keyCode, pressed) {
    switch(keyCode) {
      case 'ArrowLeft':
      case 'KeyA':
        input.keys.left = pressed;
        break;
      case 'ArrowRight':
      case 'KeyD':
        input.keys.right = pressed;
        break;
      case 'ArrowUp':
      case 'KeyW':
        input.keys.forward = pressed;
        break;
      case 'ArrowDown':
      case 'KeyS':
        input.keys.backward = pressed;
        break;
      case 'Space':
        input.keys.jump = pressed;
        break;
    }
  }
  
  destroy() {
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
  }
}