export const LEVEL_14 = {
  id: 'level_14',
  name: 'Camino Ardiente',
  difficulty: 'hard',
  segments: [
    { type: 'straight_road' },
    {
      name: 'Primer Calor',
      exitPoint: { x: 0, y: 0, z: -80 },
      obstacles: [
        { x: 0, y: -1, z: -20, size: [18, 2, 25], type: 'BURNING' },
        { x: -12, y: 0.1, z: -30, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 12, y: -1, z: -45, size: [18, 2, 25], type: 'BURNING' },
        { x: 0, y: 0.1, z: -55, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -70, size: [18, 2, 25], type: 'BURNING' }
      ]
    },
    { type: 'hazard_road' },
    { type: 'split_path' },
    {
      type: 'custom_grid',
      name: 'Infierno de Fuego',
      length: 160,
      grid: [
        [1, 1, 1],
        [3, 1, 3],
        [1, 0, 1],
        [3, 1, 3],
        [1, 1, 1],
        [3, 0, 3],
        [1, 1, 1],
        [3, 1, 3]
      ]
    },
    { type: 'gentle_climb' },
    {
      name: 'Oasis de Recuperación',
      exitPoint: { x: 0, y: 0, z: -110 },
      obstacles: [
        { x: 0, y: -1, z: -30, size: [20, 2, 30], type: 'NORMAL' },
        { x: -12, y: 0.1, z: -40, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 12, y: 0.1, z: -60, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -80, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -100, size: [12, 1, 15], type: 'BOOST' }
      ]
    },
    { type: 'island_hops' },
    {
      type: 'custom_grid',
      name: 'Brasas y Saltos',
      length: 150,
      grid: [
        [1, 1, 1],
        [0, 3, 0],
        [1, 0, 1],
        [3, 1, 3],
        [0, 1, 0],
        [1, 3, 1],
        [1, 1, 1]
      ]
    },
    { type: 'block_field' },
    { type: 'narrow_bridge' },
    {
      name: 'Zona Crítica',
      exitPoint: { x: 0, y: 0, z: -140 },
      obstacles: [
        { x: 0, y: -1, z: -25, size: [16, 2, 25], type: 'BURNING' },
        { x: -10, y: -1, z: -55, size: [12, 2, 20], type: 'SLIPPERY' },
        { x: 10, y: -1, z: -85, size: [16, 2, 25], type: 'BURNING' },
        { x: 0, y: 0.1, z: -100, size: [8, 2, 12], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -125, size: [16, 2, 25], type: 'BURNING' }
      ]
    },
    { type: 'step_sequence' },
    {
      type: 'custom_grid',
      name: 'Últimas Llamas',
      length: 140,
      grid: [
        [1, 1, 1],
        [1, 3, 1],
        [0, 1, 0],
        [1, 1, 1],
        [3, 2, 3],
        [1, 1, 1]
      ]
    },
    { type: 'straight_road' }
  ]
};
