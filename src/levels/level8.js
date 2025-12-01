export const LEVEL_8 = {
  id: 'level_8',
  name: 'Pista Peligrosa',
  difficulty: 'medium',
  segments: [
    { type: 'hazard_road' },
    { type: 'block_field' },
    {
      type: 'custom_grid',
      name: 'Líneas de Fuego',
      length: 120,
      grid: [
        [1, 3, 1],
        [0, 1, 0],
        [1, 3, 1],
        [1, 1, 1],
        [3, 1, 3],
        [1, 1, 1]
      ]
    },
    { type: 'gentle_climb' },
    { type: 'hazard_road' }, // Más peligro
    { 
      type: 'custom_grid',
      length: 250,
      grid: [
        { x: 0, y: 0, z: -20, size: [10, 1, 10], type: 'NORMAL' },
        // Zona de fuego cruzado
        { x: -10, y: 0, z: -50, size: [8, 1, 8], type: 'BURNING' },
        { x: 10, y: 0, z: -50, size: [8, 1, 8], type: 'BURNING' },
        { x: 0, y: 0, z: -50, size: [8, 1, 8], type: 'NORMAL' },
        // Suministros arriesgados
        { x: 0, y: 0, z: -80, size: [6, 1, 20], type: 'SLIPPERY' },
        { x: -8, y: 1, z: -80, size: [6, 1, 6], type: 'SUPPLIES' },
        { x: 8, y: 1, z: -80, size: [6, 1, 6], type: 'SUPPLIES' },
        // Salto sobre fuego
        { x: 0, y: 0, z: -110, size: [10, 1, 10], type: 'BOOST' },
        { x: 0, y: -2, z: -140, size: [30, 1, 30], type: 'BURNING' }, // Foso de fuego
        { x: 0, y: 4, z: -170, size: [12, 1, 12], type: 'NORMAL' }
      ]
    },
    { type: 'narrow_bridge' },
    {
      name: 'Guantelete Final',
      exitPoint: { x: 0, y: 0, z: -100 },
      obstacles: [
        { x: 0, y: -1, z: -50, size: [15, 2, 100], type: 'NORMAL' },
        { x: 0, y: 0.1, z: -20, size: [15, 1, 5], type: 'BURNING' },
        { x: -5, y: 0.1, z: -40, size: [5, 1, 5], type: 'BOOST' },
        { x: 5, y: 0.1, z: -40, size: [5, 1, 5], type: 'BOOST' },
        { x: 0, y: 0.1, z: -60, size: [15, 1, 5], type: 'BURNING' },
        { x: 0, y: 0.1, z: -80, size: [10, 1, 10], type: 'GOAL' }
      ]
    }
  ]
};