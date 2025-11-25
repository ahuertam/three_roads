export const LEVEL_12 = {
  id: 'level_12',
  name: 'Laberinto Vertical',
  difficulty: 'hard',
  segments: [
    { type: 'gentle_climb' },
    { type: 'step_sequence' },
    {
      name: 'Escaleras Pegajosas',
      exitPoint: { x: 0, y: 5, z: -80 },
      obstacles: [
        { x: 0, y: 0, z: -20, size: [15, 2, 20], type: 'STICKY' },
        { x: 10, y: 2, z: -40, size: [15, 2, 20], type: 'STICKY' },
        { x: -10, y: 4, z: -60, size: [15, 2, 20], type: 'STICKY' }
      ]
    },
    { type: 'island_hops' },
    {
      type: 'custom_grid',
      name: 'Ascenso Complicado',
      length: 140,
      grid: [
        [1, 1, 1],
        [0, 1, 0],
        [1, 2, 1],
        [1, 0, 1],
        [0, 1, 0],
        [2, 1, 2],
        [1, 1, 1]
      ]
    },
    { type: 'narrow_bridge' },
    {
      name: 'Plataformas Resbaladizas',
      exitPoint: { x: 0, y: 0, z: -180 },
      obstacles: [
        { x: 0, y: -1, z: -30, size: [18, 2, 35], type: 'SLIPPERY' },
        { x: -14, y: -1, z: -75, size: [16, 2, 35], type: 'SLIPPERY' },
        { x: 14, y: -1, z: -120, size: [16, 2, 35], type: 'SLIPPERY' },
        { x: 0, y: -1, z: -165, size: [18, 2, 35], type: 'SLIPPERY' }
      ]
    },
    { type: 'hazard_road' },
    { type: 'small_gap' },
    {
      type: 'custom_grid',
      name: 'Torre de Obstáculos',
      length: 160,
      grid: [
        [1, 1, 1],
        [3, 0, 1],
        [1, 1, 0],
        [0, 1, 3],
        [1, 2, 1],
        [1, 0, 1],
        [0, 1, 0],
        [1, 1, 1]
      ]
    },
    { type: 'split_path' },
    { type: 'block_field' },
    {
      name: 'Descenso de Impulso',
      exitPoint: { x: 0, y: -3, z: -100 },
      obstacles: [
        { x: 0, y: 0, z: -25, size: [18, 2, 25], type: 'BOOST' },
        { x: 0, y: -1, z: -50, size: [18, 2, 25], type: 'NORMAL' },
        { x: 0, y: -2, z: -75, size: [18, 2, 25], type: 'BOOST' }
      ]
    },
    { type: 'gentle_climb' },
    {
      type: 'custom_grid',
      name: 'Cúspide Final',
      length: 120,
      grid: [
        [1, 1, 1],
        [1, 0, 1],
        [3, 1, 3],
        [1, 1, 1]
      ]
    },
    { type: 'straight_road' }
  ]
};
