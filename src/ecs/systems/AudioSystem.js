export class AudioSystem {
  constructor() {
    this.sounds = new Map();
    this.audioContext = null;
    this.masterVolume = 0.5;
    this.soundEnabled = true;
    
    // Inicializar contexto de audio
    this.initAudioContext();
    
    // Cargar sonidos
    this.loadSounds();
  }
  
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext no disponible:', error);
      this.soundEnabled = false;
    }
  }
  
  async loadSounds() {
    if (!this.soundEnabled) return;
    
    // CORREGIDO: Rutas correctas para archivos en public
    const soundFiles = {
      jump: '/sounds/cartoon-jump-6462.mp3',
      bounce: '/sounds/rubberballbouncing-251948.mp3'
    };
    
    for (const [name, path] of Object.entries(soundFiles)) {
      try {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = this.masterVolume;
        
        // Crear múltiples instancias para permitir sonidos superpuestos
        this.sounds.set(name, {
          instances: [audio],
          currentIndex: 0,
          maxInstances: 3
        });
        
        // Precargar instancias adicionales
        for (let i = 1; i < 3; i++) {
          const additionalAudio = new Audio(path);
          additionalAudio.preload = 'auto';
          additionalAudio.volume = this.masterVolume;
          this.sounds.get(name).instances.push(additionalAudio);
        }
        
        console.log(`Sonido cargado: ${name} desde ${path}`);
      } catch (error) {
        console.warn(`Error cargando sonido ${name}:`, error);
      }
    }
  }
  
  playSound(soundName, volume = 1.0, pitch = 1.0) {
    if (!this.soundEnabled || !this.sounds.has(soundName)) {
      console.warn(`Sonido no disponible: ${soundName}`);
      return;
    }
    
    const soundData = this.sounds.get(soundName);
    const { instances, currentIndex, maxInstances } = soundData;
    
    // Obtener la siguiente instancia disponible
    const audio = instances[currentIndex];
    
    // Configurar volumen y velocidad de reproducción (pitch)
    audio.volume = Math.min(1.0, this.masterVolume * volume);
    audio.playbackRate = Math.max(0.5, Math.min(2.0, pitch));
    
    // Reproducir sonido
    audio.currentTime = 0; // Reiniciar desde el principio
    audio.play().then(() => {
      console.log(`Reproduciendo sonido: ${soundName}`);
    }).catch(error => {
      console.warn(`Error reproduciendo sonido ${soundName}:`, error);
    });
    
    // Actualizar índice para la siguiente reproducción
    soundData.currentIndex = (currentIndex + 1) % maxInstances;
  }
  
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Actualizar volumen de todas las instancias
    for (const soundData of this.sounds.values()) {
      soundData.instances.forEach(audio => {
        audio.volume = this.masterVolume;
      });
    }
  }
  
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }
  
  // Método para reproducir sonido de salto con variación
  playJumpSound(intensity = 1.0) {
    const volume = Math.min(1.0, 0.6 + (intensity * 0.4));
    const pitch = 0.9 + (Math.random() * 0.2); // Variación ligera en el pitch
    this.playSound('jump', volume, pitch);
  }
  
  // Método para reproducir sonido de rebote con variación basada en intensidad
  playBounceSound(bounceIntensity = 1.0, bounceCount = 1) {
    const volume = Math.min(1.0, 0.4 + (bounceIntensity * 0.6));
    const pitch = Math.max(0.7, 1.2 - (bounceCount * 0.1)); // Pitch más bajo en rebotes sucesivos
    this.playSound('bounce', volume, pitch);
  }
}

// Instancia global del sistema de audio
export const audioSystem = new AudioSystem();