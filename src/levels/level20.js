export const LEVEL_20 = {
  id: 'level_20',
  name: 'Pesadilla Geométrica',
  difficulty: 'extreme',
  segments: [
    { type: 'block_field' },
    { type: 'split_path' },
    {
      type: 'custom_grid',
      name: 'Geometría Imposible I',
      length: 220,
      grid: [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
        [0, 2, 0],
        [1, 0, 1],
        [0, 3, 0],
        [1, 0, 1],
        [0, 1, 0],
        [3, 0, 3],
        [0, 1, 0]
      ]
    },
    { type: 'island_hops' },
    { type: 'narrow_bridge' },
    {
      name: 'Caos Dimensional',
      exitPoint: { x: 0, y: 0, z: -240 },
      obstacles: [
        { x: -15, y: -1, z: -30, size: [10, 2, 15], type: 'STICKY' },
        { x: 15, y: -1, z: -60, size: [10, 2, 15], type: 'SLIPPERY' },
        { x: -12, y: -1, z: -90, size: [10, 2, 15], type: 'BURNING' },
        { x: 0, y: 0.1, z: -110, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 12, y: -1, z: -135, size: [10, 2, 15], type: 'STICKY' },
        { x: -15, y: -1, z: -165, size: [10, 2, 15], type: 'SLIPPERY' },
        { x: 15, y: -1, z: -195, size: [10, 2, 15], type: 'BURNING' },
        { x: 0, y: 0.1, z: -215, size: [8, 2, 10], type: 'SUPPLIES' }
      ]
    },
    { type: 'step_sequence' },
    { type: 'hazard_road' },
    {
      type: 'custom_grid',
      name: 'Geometría Imposible II',
      length: 230,
      grid: [
        [3, 1, 3],
        [0, 2, 0],
        [1, 0, 1],
        [3, 1, 3],
        [0, 0, 0],
        [1, 2, 1],
        [0, 3, 0],
        [1, 0, 1],
        [3, 0, 3],
        [0, 1, 0],
        [1, 3, 1]
      ]
    },
    { type: 'block_field' },
    { type: 'small_gap' },
    {
      name: 'Vórtice de Plataformas',
      exitPoint: { x: 0, y: 0, z: -210 },
      obstacles: [
        { x: 0, y: -1, z: -25, size: [12, 2, 18], type: 'BURNING' },
        { x: -14, y: -1, z: -55, size: [12, 2, 18], type: 'STICKY' },
        { x: 14, y: -1, z: -85, size: [12, 2, 18], type: 'SLIPPERY' },
        { x: 0, y: 0.1, z: -105, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -125, size: [12, 1, 15], type: 'BOOST' },
        { x: -12, y: -1, z: -150, size: [12, 2, 18], type: 'BURNING' },
        { x: 12, y: -1, z: -180, size: [12, 2, 18], type: 'STICKY' },
        { x: 0, y: -1, z: -205, size: [12, 2, 18], type: 'SLIPPERY' }
      ]
    },
    { type: 'gentle_climb' },
    { type: 'island_hops' },
    {
      type: 'custom_grid',
      name: 'Geometría Imposible III',
      length: 240,
      grid: [
        [1, 1, 1],
        [3, 0, 3],
        [0, 1, 0],
        [2, 0, 2],
        [1, 1, 1],
        [0, 3, 0],
        [1, 0, 1],
        [3, 1, 3],
        [0, 2, 0],
        [1, 0, 1],
        [3, 1, 3],
        [1, 1, 1]
      ]
    },
    { type: 'narrow_bridge' },
    { type: 'split_path' },
    {
      name: 'Salida del Abismo',
      exitPoint: { x: 0, y: 0, z: -150 },
      obstacles: [
        { x: 0, y: -1, z: -40, size: [16, 2, 40], type: 'NORMAL' },
        { x: -12, y: 0.1, z: -70, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 12, y: 0.1, z: -100, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -130, size: [14, 1, 18], type: 'BOOST' }
      ]
    },
    { type: 'straight_road' }
  ]
};
