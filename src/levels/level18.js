export const LEVEL_18 = {
  id: 'level_18',
  name: 'Zona Resbaladiza',
  difficulty: 'very hard',
  segments: [
    { type: 'straight_road' },
    {
      name: 'Hielo Inicial',
      exitPoint: { x: 0, y: 0, z: -150 },
      obstacles: [
        { x: 0, y: -1, z: -30, size: [20, 2, 40], type: 'SLIPPERY' },
        { x: -14, y: -1, z: -80, size: [18, 2, 40], type: 'SLIPPERY' },
        { x: 14, y: -1, z: -130, size: [18, 2, 40], type: 'SLIPPERY' }
      ]
    },
    { type: 'island_hops' },
    {
      type: 'custom_grid',
      name: 'Pista de Hielo',
      length: 190,
      grid: [
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
        [1, 1, 1],
        [0, 2, 0],
        [1, 0, 1],
        [0, 1, 0]
      ]
    },
    { type: 'narrow_bridge' },
    {
      name: 'Alternancia Pegajosa',
      exitPoint: { x: 0, y: 0, z: -210 },
      obstacles: [
        { x: 0, y: -1, z: -30, size: [18, 2, 28], type: 'SLIPPERY' },
        { x: -14, y: -1, z: -65, size: [16, 2, 25], type: 'STICKY' },
        { x: 14, y: -1, z: -100, size: [18, 2, 28], type: 'SLIPPERY' },
        { x: 0, y: 0.1, z: -125, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: -12, y: -1, z: -155, size: [16, 2, 25], type: 'STICKY' },
        { x: 12, y: -1, z: -190, size: [18, 2, 28], type: 'SLIPPERY' }
      ]
    },
    { type: 'step_sequence' },
    { type: 'split_path' },
    {
      type: 'custom_grid',
      name: 'Laberinto Congelado',
      length: 200,
      grid: [
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
        [1, 1, 1],
        [1, 0, 1]
      ]
    },
    { type: 'hazard_road' },
    {
      name: 'Peligro Resbaloso',
      exitPoint: { x: 0, y: 0, z: -170 },
      obstacles: [
        { x: 0, y: -1, z: -25, size: [16, 2, 24], type: 'SLIPPERY' },
        { x: -15, y: -1, z: -60, size: [12, 2, 20], type: 'BURNING' },
        { x: 0, y: 0.1, z: -75, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 15, y: -1, z: -95, size: [16, 2, 24], type: 'SLIPPERY' },
        { x: 0, y: -1, z: -125, size: [14, 2, 20], type: 'STICKY' },
        { x: 0, y: 0.1, z: -145, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -165, size: [16, 2, 24], type: 'SLIPPERY' }
      ]
    },
    { type: 'block_field' },
    { type: 'gentle_climb' },
    {
      type: 'custom_grid',
      name: 'Descenso Helado',
      length: 180,
      grid: [
        [1, 1, 1],
        [1, 0, 1],
        [0, 1, 0],
        [1, 3, 1],
        [0, 1, 0],
        [1, 0, 1],
        [1, 1, 1]
      ]
    },
    { type: 'island_hops' },
    {
      name: 'Recta Final Pegajosa',
      exitPoint: { x: 0, y: 0, z: -130 },
      obstacles: [
        { x: 0, y: -1, z: -40, size: [18, 2, 40], type: 'STICKY' },
        { x: 0, y: 0.1, z: -70, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -105, size: [18, 2, 35], type: 'STICKY' }
      ]
    },
    { type: 'straight_road' }
  ]
};
