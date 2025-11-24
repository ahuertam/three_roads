export const LEVEL_1 = {
  id: 'level_1',
  name: 'The Beginning',
  difficulty: 'easy',
  segments: [
    // 1. Inicio suave
    { type: 'straight_road' }, // Referencia a patrón existente
    
    // 2. Primer desafío de grid: Tres caminos simples
    {
      type: 'custom_grid',
      name: 'Three Lanes',
      length: 60,
      grid: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ]
    },
    
    // 3. Pequeño salto
    { type: 'small_gap' },
    
    // 4. Grid con obstáculos: Esquivar centro
    {
      type: 'custom_grid',
      name: 'Dodge Center',
      length: 100,
      grid: [
        [1, 1, 1],
        [1, 0, 1], // Hueco en centro
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 0]  // Hueco en lados
      ]
    },
    
    // 5. Subida
    { type: 'gentle_climb' },
    
    // 6. Grid complejo: Saltos y peligros
    {
      type: 'custom_grid',
      name: 'Jump and Burn',
      length: 120,
      grid: [
        [1, 1, 1],
        [1, 3, 1], // Fuego en centro (3)
        [0, 1, 0], // Solo centro seguro
        [1, 0, 1], // Lados seguros
        [2, 2, 2], // Muro/Salto (2)
        [1, 1, 1]
      ]
    },
    
    // 7. Final relajado
    { type: 'straight_road' }
  ]
};
