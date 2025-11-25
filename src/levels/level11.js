export const LEVEL_11 = {
  id: 'level_11',
  name: 'Expansión Inicial',
  difficulty: 'hard',
  segments: [
    { type: 'straight_road' },
    { type: 'split_path' },
    { type: 'small_gap' },
    {
      type: 'custom_grid',
      name: 'Calentamiento',
      length: 120,
      grid: [
        [1, 1, 1],
        [1, 0, 1],
        [0, 1, 0],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
      ]
    },
    { type: 'gentle_climb' },
    { type: 'step_sequence' },
    {
      name: 'Zona de Suministros',
      exitPoint: { x: 0, y: 0, z: -100 },
      obstacles: [
        { x: 0, y: -1, z: -50, size: [20, 2, 100], type: 'NORMAL' },
        { x: -10, y: 0.1, z: -25, size: [8, 2, 12], type: 'SUPPLIES' },
        { x: 10, y: 0.1, z: -50, size: [8, 2, 12], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -75, size: [8, 2, 12], type: 'SUPPLIES' }
      ]
    },
    {
      name: 'Zona Pegajosa',
      exitPoint: { x: 0, y: 0, z: -120 },
      obstacles: [
        { x: -12, y: -1, z: -30, size: [14, 2, 30], type: 'STICKY' },
        { x: 12, y: -1, z: -70, size: [14, 2, 30], type: 'STICKY' },
        { x: 0, y: -1, z: -105, size: [16, 2, 25], type: 'STICKY' }
      ]
    },
    { type: 'island_hops' },
    { type: 'hazard_road' },
    {
      type: 'custom_grid',
      name: 'Zigzag Peligroso',
      length: 150,
      grid: [
        [1, 1, 1],
        [3, 0, 1],
        [0, 1, 0],
        [1, 0, 3],
        [1, 1, 1],
        [0, 2, 0],
        [1, 1, 1]
      ]
    },
    { type: 'narrow_bridge' },
    {
      name: 'Impulso Triple',
      exitPoint: { x: 0, y: 0, z: -90 },
      obstacles: [
        { x: 0, y: -1, z: -45, size: [18, 2, 90], type: 'NORMAL' },
        { x: 0, y: 0.1, z: -20, size: [12, 1, 15], type: 'BOOST' },
        { x: 0, y: 0.1, z: -45, size: [12, 1, 15], type: 'BOOST' },
        { x: 0, y: 0.1, z: -70, size: [12, 1, 15], type: 'BOOST' }
      ]
    },
    { type: 'block_field' },
    { type: 'split_path' },
    {
      type: 'custom_grid',
      name: 'Final Ardiente',
      length: 130,
      grid: [
        [1, 1, 1],
        [1, 3, 1],
        [0, 1, 0],
        [3, 1, 3],
        [1, 1, 1],
        [1, 0, 1]
      ]
    },
    { type: 'straight_road' }
  ]
};
