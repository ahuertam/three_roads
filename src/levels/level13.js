export const LEVEL_13 = {
  id: 'level_13',
  name: 'Prueba de Precisión',
  difficulty: 'hard',
  segments: [
    { type: 'island_hops' },
    { type: 'island_hops' },
    {
      name: 'Islas Resbaladizas',
      exitPoint: { x: 0, y: 0, z: -150 },
      obstacles: [
        { x: 0, y: -1, z: -25, size: [12, 2, 20], type: 'SLIPPERY' },
        { x: -15, y: -1, z: -55, size: [12, 2, 20], type: 'SLIPPERY' },
        { x: 15, y: -1, z: -85, size: [12, 2, 20], type: 'SLIPPERY' },
        { x: 0, y: -1, z: -115, size: [12, 2, 20], type: 'SLIPPERY' },
        { x: -12, y: -1, z: -140, size: [10, 2, 15], type: 'SUPPLIES' }
      ]
    },
    { type: 'narrow_bridge' },
    {
      type: 'custom_grid',
      name: 'Camino Estrecho',
      length: 150,
      grid: [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
        [0, 2, 0],
        [1, 0, 1],
        [0, 1, 0]
      ]
    },
    { type: 'small_gap' },
    { type: 'small_gap' },
    {
      name: 'Saltos Pegajosos',
      exitPoint: { x: 0, y: 0, z: -160 },
      obstacles: [
        { x: -12, y: -1, z: -30, size: [12, 2, 30], type: 'STICKY' },
        { x: 12, y: -1, z: -65, size: [12, 2, 30], type: 'STICKY' },
        { x: -10, y: -1, z: -100, size: [12, 2, 30], type: 'STICKY' },
        { x: 10, y: -1, z: -135, size: [12, 2, 30], type: 'STICKY' }
      ]
    },
    { type: 'step_sequence' },
    {
      type: 'custom_grid',
      name: 'Patrón Alternado',
      length: 170,
      grid: [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
        [0, 2, 0],
        [1, 0, 1],
        [0, 1, 0],
        [3, 0, 3],
        [0, 1, 0]
      ]
    },
    { type: 'island_hops' },
    { type: 'hazard_road' },
    {
      name: 'Plataformas Ardientes',
      exitPoint: { x: 0, y: 0, z: -100 },
      obstacles: [
        { x: 0, y: -1, z: -20, size: [15, 2, 20], type: 'BURNING' },
        { x: -10, y: 0.1, z: -35, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 10, y: -1, z: -50, size: [15, 2, 20], type: 'BURNING' },
        { x: 0, y: 0.1, z: -65, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -85, size: [15, 2, 20], type: 'BURNING' }
      ]
    },
    { type: 'narrow_bridge' },
    {
      type: 'custom_grid',
      name: 'Gran Final',
      length: 140,
      grid: [
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1],
        [1, 1, 1],
        [3, 0, 3],
        [1, 1, 1]
      ]
    },
    { type: 'straight_road' }
  ]
};
