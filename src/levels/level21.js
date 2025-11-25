export const LEVEL_21 = {
  id: 'level_21',
  name: 'El Desafío Final',
  difficulty: 'extreme',
  segments: [
    { type: 'straight_road' },
    { type: 'split_path' },
    { type: 'island_hops' },
    {
      type: 'custom_grid',
      name: 'Preludio del Fin',
      length: 250,
      grid: [
        [1, 1, 1],
        [1, 0, 1],
        [0, 1, 0],
        [1, 3, 1],
        [0, 2, 0],
        [1, 0, 1],
        [3, 1, 3],
        [1, 0, 1],
        [0, 1, 0],
        [1, 1, 1]
      ]
    },
    { type: 'step_sequence' },
    { type: 'narrow_bridge' },
    {
      name: 'Prueba de Todos los Elementos I',
      exitPoint: { x: 0, y: 0, z: -260 },
      obstacles: [
        { x: 0, y: -1, z: -30, size: [16, 2, 25], type: 'NORMAL' },
        { x: -14, y: -1, z: -65, size: [14, 2, 22], type: 'STICKY' },
        { x: 14, y: -1, z: -100, size: [14, 2, 22], type: 'SLIPPERY' },
        { x: 0, y: 0.1, z: -125, size: [8, 2, 12], type: 'SUPPLIES' },
        { x: -12, y: -1, z: -155, size: [14, 2, 22], type: 'BURNING' },
        { x: 12, y: 0.1, z: -180, size: [12, 1, 15], type: 'BOOST' },
        { x: 0, y: -1, z: -210, size: [14, 2, 22], type: 'STICKY' },
        { x: 0, y: 0.1, z: -235, size: [8, 2, 12], type: 'SUPPLIES' }
      ]
    },
    { type: 'block_field' },
    { type: 'hazard_road' },
    {
      type: 'custom_grid',
      name: 'El Laberinto Definitivo',
      length: 270,
      grid: [
        [1, 0, 1],
        [0, 1, 0],
        [3, 0, 3],
        [0, 1, 0],
        [1, 2, 1],
        [0, 3, 0],
        [1, 0, 1],
        [3, 1, 3],
        [0, 0, 0],
        [1, 2, 1],
        [0, 3, 0],
        [1, 0, 1],
        [3, 1, 3]
      ]
    },
    { type: 'small_gap' },
    { type: 'island_hops' },
    {
      name: 'Prueba de Todos los Elementos II',
      exitPoint: { x: 0, y: 0, z: -280 },
      obstacles: [
        { x: -16, y: -1, z: -35, size: [12, 2, 20], type: 'BURNING' },
        { x: 16, y: -1, z: -70, size: [12, 2, 20], type: 'SLIPPERY' },
        { x: 0, y: 0.1, z: -95, size: [10, 2, 12], type: 'SUPPLIES' },
        { x: -14, y: -1, z: -125, size: [12, 2, 20], type: 'STICKY' },
        { x: 14, y: 0.1, z: -155, size: [12, 1, 15], type: 'BOOST' },
        { x: 0, y: -1, z: -185, size: [12, 2, 20], type: 'BURNING' },
        { x: 0, y: 0.1, z: -210, size: [10, 2, 12], type: 'SUPPLIES' },
        { x: -12, y: -1, z: -240, size: [12, 2, 20], type: 'SLIPPERY' },
        { x: 12, y: -1, z: -270, size: [12, 2, 20], type: 'STICKY' }
      ]
    },
    { type: 'gentle_climb' },
    { type: 'step_sequence' },
    {
      type: 'custom_grid',
      name: 'La Ascensión Final',
      length: 260,
      grid: [
        [1, 1, 1],
        [3, 0, 3],
        [1, 1, 1],
        [0, 2, 0],
        [1, 3, 1],
        [0, 1, 0],
        [3, 0, 3],
        [1, 1, 1],
        [0, 2, 0],
        [1, 0, 1],
        [3, 1, 3],
        [1, 1, 1]
      ]
    },
    { type: 'block_field' },
    { type: 'narrow_bridge' },
    {
      name: 'El Abismo Final',
      exitPoint: { x: 0, y: 0, z: -300 },
      obstacles: [
        { x: -18, y: -1, z: -40, size: [10, 2, 18], type: 'BURNING' },
        { x: 18, y: -1, z: -80, size: [10, 2, 18], type: 'BURNING' },
        { x: 0, y: 0.1, z: -110, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: -15, y: -1, z: -145, size: [10, 2, 18], type: 'SLIPPERY' },
        { x: 15, y: -1, z: -180, size: [10, 2, 18], type: 'STICKY' },
        { x: 0, y: 0.1, z: -205, size: [12, 1, 15], type: 'BOOST' },
        { x: 0, y: 0.1, z: -230, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: -12, y: -1, z: -260, size: [10, 2, 18], type: 'BURNING' },
        { x: 12, y: -1, z: -290, size: [10, 2, 18], type: 'BURNING' }
      ]
    },
    { type: 'hazard_road' },
    { type: 'split_path' },
    {
      type: 'custom_grid',
      name: 'Victoria o Derrota',
      length: 280,
      grid: [
        [3, 1, 3],
        [1, 0, 1],
        [0, 1, 0],
        [1, 2, 1],
        [3, 0, 3],
        [1, 1, 1],
        [0, 3, 0],
        [1, 0, 1],
        [2, 1, 2],
        [1, 0, 1],
        [3, 1, 3],
        [0, 2, 0],
        [1, 1, 1]
      ]
    },
    { type: 'island_hops' },
    {
      name: 'La Meta Final',
      exitPoint: { x: 0, y: 0, z: -180 },
      obstacles: [
        { x: 0, y: -1, z: -50, size: [20, 2, 50], type: 'NORMAL' },
        { x: -12, y: 0.1, z: -80, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 12, y: 0.1, z: -110, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -140, size: [14, 1, 20], type: 'BOOST' },
        { x: 0, y: 0.1, z: -170, size: [12, 2, 18], type: 'SUPPLIES' }
      ]
    },
    { type: 'straight_road' }
  ]
};
