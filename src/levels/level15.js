export const LEVEL_15 = {
  id: 'level_15',
  name: 'Sinfonía del Caos',
  difficulty: 'hard',
  segments: [
    { type: 'split_path' },
    { type: 'island_hops' },
    { type: 'step_sequence' },
    {
      name: 'Mezcla Total',
      exitPoint: { x: 0, y: 0, z: -180 },
      obstacles: [
        { x: 0, y: -1, z: -20, size: [15, 2, 20], type: 'STICKY' },
        { x: -12, y: -1, z: -45, size: [15, 2, 20], type: 'SLIPPERY' },
        { x: 12, y: -1, z: -70, size: [15, 2, 20], type: 'BURNING' },
        { x: 0, y: 0.1, z: -90, size: [10, 2, 12], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -110, size: [12, 1, 18], type: 'BOOST' },
        { x: -10, y: -1, z: -135, size: [15, 2, 20], type: 'STICKY' },
        { x: 10, y: -1, z: -160, size: [15, 2, 20], type: 'SLIPPERY' }
      ]
    },
    { type: 'hazard_road' },
    {
      type: 'custom_grid',
      name: 'Patrón Caótico',
      length: 180,
      grid: [
        [1, 1, 1],
        [3, 0, 1],
        [0, 1, 3],
        [1, 2, 1],
        [3, 1, 0],
        [0, 1, 3],
        [1, 0, 1],
        [3, 1, 3],
        [1, 1, 1]
      ]
    },
    { type: 'narrow_bridge' },
    { type: 'small_gap' },
    {
      name: 'Carrera de Elementos',
      exitPoint: { x: 0, y: 0, z: -160 },
      obstacles: [
        { x: 0, y: -1, z: -20, size: [18, 2, 20], type: 'NORMAL' },
        { x: 0, y: 0.1, z: -35, size: [12, 1, 12], type: 'BOOST' },
        { x: -10, y: -1, z: -55, size: [14, 2, 18], type: 'BURNING' },
        { x: 10, y: 0.1, z: -70, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -90, size: [14, 2, 18], type: 'STICKY' },
        { x: -12, y: -1, z: -115, size: [14, 2, 18], type: 'SLIPPERY' },
        { x: 12, y: 0.1, z: -130, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -150, size: [14, 2, 18], type: 'BURNING' }
      ]
    },
    { type: 'block_field' },
    { type: 'gentle_climb' },
    {
      type: 'custom_grid',
      name: 'Sinfonía Final',
      length: 170,
      grid: [
        [1, 1, 1],
        [0, 3, 0],
        [1, 0, 1],
        [3, 1, 3],
        [1, 2, 1],
        [0, 1, 0],
        [1, 3, 1],
        [1, 1, 1]
      ]
    },
    { type: 'island_hops' },
    { type: 'split_path' },
    {
      name: 'Descanso Final',
      exitPoint: { x: 0, y: 0, z: -100 },
      obstacles: [
        { x: 0, y: -1, z: -50, size: [20, 2, 100], type: 'NORMAL' },
        { x: 0, y: 0.1, z: -30, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -70, size: [12, 1, 15], type: 'BOOST' }
      ]
    },
    { type: 'straight_road' }
  ]
};
