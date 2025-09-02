import React, { useState } from 'react';
import { PLATFORM_TYPES, OBSTACLE_TEMPLATES } from '../ecs/patterns/ObstaclePatterns.js';

function PatternEditor({ onSavePattern }) {
  const [currentPattern, setCurrentPattern] = useState({
    name: '',
    difficulty: 'medium',
    description: '',
    obstacles: []
  });
  
  const addObstacle = (template) => {
    const newObstacle = {
      x: 0,
      y: 1,
      z: -currentPattern.obstacles.length * 30,
      size: template.size,
      type: template.type
    };
    
    setCurrentPattern(prev => ({
      ...prev,
      obstacles: [...prev.obstacles, newObstacle]
    }));
  };
  
  return (
    <div className="pattern-editor">
      <h3>Editor de Patrones</h3>
      
      <div className="pattern-info">
        <input 
          type="text" 
          placeholder="Nombre del patrón"
          value={currentPattern.name}
          onChange={(e) => setCurrentPattern(prev => ({ ...prev, name: e.target.value }))}
        />
        
        <select 
          value={currentPattern.difficulty}
          onChange={(e) => setCurrentPattern(prev => ({ ...prev, difficulty: e.target.value }))}
        >
          <option value="easy">Fácil</option>
          <option value="medium">Medio</option>
          <option value="hard">Difícil</option>
        </select>
      </div>
      
      <div className="obstacle-templates">
        <h4>Plantillas de Obstáculos</h4>
        {Object.entries(OBSTACLE_TEMPLATES).map(([key, template]) => (
          <button key={key} onClick={() => addObstacle(template)}>
            {key.replace('_', ' ')}
          </button>
        ))}
      </div>
      
      <div className="pattern-preview">
        <h4>Vista Previa del Patrón</h4>
        {currentPattern.obstacles.map((obstacle, index) => (
          <div key={index} className="obstacle-item">
            Obstáculo {index + 1}: {obstacle.type} en ({obstacle.x}, {obstacle.y}, {obstacle.z})
          </div>
        ))}
      </div>
      
      <button onClick={() => onSavePattern(currentPattern)}>
        Guardar Patrón
      </button>
    </div>
  );
}

export default PatternEditor;