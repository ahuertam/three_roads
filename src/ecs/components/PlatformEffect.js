export class PlatformEffect {
  constructor() {
    this.currentEffect = 'none';
    this.effectDuration = 0;
    this.effectTimer = 0;
    this.supplies = 100; // Combustible/suministros
    this.maxSupplies = 100;
  }
  
  applyEffect(effectType) {
    this.currentEffect = effectType;
    this.effectTimer = 0;
    
    switch(effectType) {
      case 'boost':
        this.effectDuration = 2000; // 2 segundos
        break;
      case 'sticky':
        this.effectDuration = 3000; // 3 segundos
        break;
      case 'slippery':
        this.effectDuration = 2500; // 2.5 segundos
        break;
      case 'burning':
        this.effectDuration = 1000; // 1 segundo de daño
        break;
      case 'supplies':
        this.supplies = Math.min(this.supplies + 40, this.maxSupplies); // Aumentado de 25 a 40
        this.effectDuration = 0; // Efecto instantáneo
        break;
      default:
        this.effectDuration = 0;
    }
  }
  
  update(deltaTime) {
    if (this.effectTimer < this.effectDuration) {
      this.effectTimer += deltaTime * 1000;
    } else {
      this.currentEffect = 'none';
    }
    
    // NO consumir suministros gradualmente - solo al acelerar
    // Comentado para eliminar el consumo pasivo
    // if (this.supplies > 0) {
    //   this.supplies = Math.max(0, this.supplies - deltaTime * 0.5);
    // }
  }
  
  isEffectActive(effectType) {
    return this.currentEffect === effectType && this.effectTimer < this.effectDuration;
  }
  
  getSuppliesPercentage() {
    return (this.supplies / this.maxSupplies) * 100;
  }
}