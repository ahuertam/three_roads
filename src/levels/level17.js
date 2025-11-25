export const LEVEL_17 = {
  id: 'level_17',
  name: 'Tormenta de Obstáculos',
  difficulty: 'very hard',
  segments: [
    { type: 'block_field' },
    { type: 'hazard_road' },
    { type: 'block_field' },
    {
      type: 'custom_grid',
      name: 'Campo de Batalla',
      length: 200,
      grid: [
        [1, 1, 1],
        [3, 2, 3],
        [1, 0, 1],
        [2, 1, 2],
        [0, 3, 0],
        [1, 2, 1],
        [3, 0, 3],
        [1, 1, 1],
        [2, 3, 2],
        [1, 1, 1]
      ]
    },
    { type: 'split_path' },
    { type: 'narrow_bridge' },
    {
      name: 'Caos de Elementos',
      exitPoint: { x: 0, y: 0, z: -190 },
      obstacles: [
        { x: 0, y: -1, z: -20, size: [16, 2, 20], type: 'BURNING' },
        { x: -12, y: -1, z: -45, size: [14, 2, 18], type: 'STICKY' },
        { x: 12, y: -1, z: -70, size: [14, 2, 18], type: 'SLIPPERY' },
        { x: 0, y: 0.1, z: -88, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: -10, y: -1, z: -110, size: [16, 2, 20], type: 'BURNING' },
        { x: 10, y: -1, z: -135, size: [14, 2, 18], type: 'STICKY' },
        { x: 0, y: 0.1, z: -152, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -175, size: [14, 2, 18], type: 'SLIPPERY' }
      ]
    },
    { type: 'step_sequence' },
    { type: 'island_hops' },
    {
      type: 'custom_grid',
      name: 'Tormenta Perfecta',
      length: 210,
      grid: [
        [3, 1, 3],
        [1, 2, 1],
        [0, 1, 0],
        [3, 0, 3],
        [1, 1, 1],
        [2, 3, 2],
        [1, 0, 1],
        [3, 1, 3],
        [0, 2, 0],
        [1, 1, 1]
      ]
    },
    { type: 'hazard_road' },
    { type: 'block_field' },
    {
      name: 'Centro del Huracán',
      exitPoint: { x: 0, y: 0, z: -160 },
      obstacles: [
        { x: -15, y: -1, z: -30, size: [12, 2, 20], type: 'BURNING' },
        { x: 15, y: -1, z: -60, size: [12, 2, 20], type: 'BURNING' },
        { x: 0, y: 0.1, z: -80, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -100, size: [12, 1, 15], type: 'BOOST' },
        { x: -12, y: -1, z: -125, size: [12, 2, 20], type: 'BURNING' },
        { x: 12, y: -1, z: -150, size: [12, 2, 20], type: 'BURNING' }
      ]
    },
    { type: 'gentle_climb' },
    {
      type: 'custom_grid',
      name: 'Calma Después de la Tormenta',
      length: 140,
      grid: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 0],
        [1, 1, 1]
      ]
    },
    { type: 'straight_road' }
  ]
};
