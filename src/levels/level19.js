export const LEVEL_19 = {
  id: 'level_19',
  name: 'Inferno Acelerado',
  difficulty: 'very hard',
  segments: [
    { type: 'hazard_road' },
    {
      name: 'Llamas Iniciales',
      exitPoint: { x: 0, y: 0, z: -140 },
      obstacles: [
        { x: 0, y: -1, z: -25, size: [18, 2, 24], type: 'BURNING' },
        { x: 0, y: 0.1, z: -40, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: -12, y: -1, z: -65, size: [16, 2, 22], type: 'BURNING' },
        { x: 12, y: -1, z: -95, size: [16, 2, 22], type: 'BURNING' },
        { x: 0, y: 0.1, z: -115, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -135, size: [18, 2, 24], type: 'BURNING' }
      ]
    },
    { type: 'split_path' },
    {
      type: 'custom_grid',
      name: 'Carril de Fuego',
      length: 210,
      grid: [
        [1, 1, 1],
        [3, 1, 3],
        [1, 0, 1],
        [3, 1, 3],
        [0, 1, 0],
        [3, 2, 3],
        [1, 1, 1],
        [3, 0, 3],
        [1, 1, 1],
        [3, 1, 3]
      ]
    },
    {
      name: 'Impulso Ardiente',
      exitPoint: { x: 0, y: 0, z: -120 },
      obstacles: [
        { x: 0, y: -1, z: -20, size: [16, 2, 20], type: 'BURNING' },
        { x: 0, y: 0.1, z: -35, size: [12, 1, 15], type: 'BOOST' },
        { x: -12, y: -1, z: -60, size: [16, 2, 20], type: 'BURNING' },
        { x: 12, y: 0.1, z: -75, size: [12, 1, 15], type: 'BOOST' },
        { x: 0, y: 0.1, z: -92, size: [8, 2, 10], type: 'SUPPLIES' },
        { x: 0, y: -1, z: -110, size: [16, 2, 20], type: 'BURNING' }
      ]
    },
    { type: 'island_hops' },
    { type: 'block_field' },
    {
      type: 'custom_grid',
      name: 'Tormenta Ígnea',
      length: 200,
      grid: [
        [1, 1, 1],
        [3, 1, 3],
        [1, 2, 1],
        [3, 0, 3],
        [1, 1, 1],
        [3, 1, 3],
        [0, 1, 0],
        [3, 1, 3],
        [1, 1, 1]
      ]
    },
    { type: 'step_sequence' },
    { type: 'narrow_bridge' },
    {
      name: 'Velocidad Extrema',
      exitPoint: { x: 0, y: 0, z: -180 },
      obstacles: [
        { x: 0, y: 0.1, z: -20, size: [14, 1, 18], type: 'BOOST' },
        { x: -15, y: -1, z: -50, size: [14, 2, 20], type: 'BURNING' },
        { x: 15, y: -1, z: -80, size: [14, 2, 20], type: 'BURNING' },
        { x: 0, y: 0.1, z: -100, size: [8, 2, 12], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -120, size: [14, 1, 18], type: 'BOOST' },
        { x: -12, y: -1, z: -145, size: [14, 2, 20], type: 'BURNING' },
        { x: 12, y: -1, z: -170, size: [14, 2, 20], type: 'BURNING' }
      ]
    },
    { type: 'hazard_road' },
    { type: 'gentle_climb' },
    {
      type: 'custom_grid',
      name: 'Último Infierno',
      length: 190,
      grid: [
        [1, 1, 1],
        [3, 0, 3],
        [1, 1, 1],
        [3, 1, 3],
        [0, 2, 0],
        [3, 1, 3],
        [1, 1, 1]
      ]
    },
    {
      name: 'Escape Final',
      exitPoint: { x: 0, y: 0, z: -110 },
      obstacles: [
        { x: 0, y: -1, z: -30, size: [18, 2, 30], type: 'NORMAL' },
        { x: 0, y: 0.1, z: -60, size: [10, 2, 15], type: 'SUPPLIES' },
        { x: 0, y: 0.1, z: -90, size: [14, 1, 18], type: 'BOOST' }
      ]
    },
    { type: 'straight_road' }
  ]
};
