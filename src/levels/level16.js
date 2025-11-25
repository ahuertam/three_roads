export const LEVEL_16 = {
  id: 'level_16',
  name: 'El Gran Salto',
  difficulty: 'very hard',
  segments: [
    { type: 'island_hops' },
    { type: 'island_hops' },
    { type: 'small_gap' },
    { type: 'small_gap' },
    {
      name: 'Saltos Extremos',
      exitPoint: { x: 0, y: 0, z: -200 },
      obstacles: [
        { x: 0, y: -1, z: -20, size: [14, 2, 18], type: 'NORMAL' },
        { x: 0, y: 0.1, z: -30, size: [12, 1, 12], type: 'BOOST' },
        // Gap grande
        { x: -18, y: -1, z: -80, size: [12, 2, 16], type: 'STICKY' },
        { x: 18, y: -1, z: -125, size: [12, 2, 16], type: 'SLIPPERY' },
        { x: 0, y: 0.1, z: -140, size: [8, 2, 10], type: 'SUPPLIES' },
        // Gap enorme
        { x: 0, y: -1, z: -190, size: [14, 2, 18], type: 'NORMAL' }
      ]
    },
    { type: 'step_sequence' },
    {
      type: 'custom_grid',
      name: 'Puente Roto',
      length: 190,
      grid: [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1]
      ]
    },
    { type: 'narrow_bridge' },
    { type: 'island_hops' },
    {
      name: 'Plataformas Dispersas',
      exitPoint: { x: 0, y: 0, z: -220 },
      obstacles: [
        { x: -15, y: -1, z: -25, size: [10, 2, 12], type: 'NORMAL' },
        { x: 15, y: -1, z: -55, size: [10, 2, 12], type: 'BOOST' },
        { x: -12, y: -1, z: -90, size: [10, 2, 12], type: 'STICKY' },
        { x: 0, y: 0.1, z: -110, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 12, y: -1, z: -140, size: [10, 2, 12], type: 'SLIPPERY' },
        { x: -15, y: -1, z: -175, size: [10, 2, 12], type: 'BURNING' },
        { x: 0, y: 0.1, z: -190, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 15, y: -1, z: -210, size: [10, 2, 12], type: 'NORMAL' }
      ]
    },
    { type: 'block_field' },
    {
      type: 'custom_grid',
      name: 'Abismo Final',
      length: 180,
      grid: [
        [1, 0, 1],
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
        [1, 2, 1],
        [0, 0, 0],
        [1, 0, 1],
        [0, 1, 0]
      ]
    },
    { type: 'gentle_climb' },
    {
      name: 'Última Oportunidad',
      exitPoint: { x: 0, y: 0, z: -100 },
      obstacles: [
        { x: 0, y: -1, z: -30, size: [16, 2, 30], type: 'NORMAL' },
        { x: 0, y: 0.1, z: -55, size: [10, 2, 12], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -80, size: [12, 1, 15], type: 'BOOST' }
      ]
    },
    { type: 'straight_road' }
  ]
};
