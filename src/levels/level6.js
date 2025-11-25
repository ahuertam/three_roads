export const LEVEL_6 = {
  id: 'level_6',
  name: 'Ritmo Acelerado',
  difficulty: 'medium',
  segments: [
    { type: 'straight_road' },
    {
      type: 'custom_grid',
      name: 'Zig-Zag Suave',
      length: 90,
      grid: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 0],
        [1, 1, 1],
        [1, 0, 1]
      ]
    },
    { type: 'small_gap' },
    { type: 'gentle_climb' },
    {
      name: 'Sprint Final',
      exitPoint: { x: 0, y: 0, z: -80 },
      obstacles: [
        // Plataforma base para colocar boosts
        { x: 0, y: -1, z: -40, size: [20, 2, 80], type: 'NORMAL' },
        // Tres boosts centrados
        { x: 0, y: 0.1, z: -20, size: [10, 1, 15], type: 'BOOST' },
        { x: 0, y: 0.1, z: -40, size: [10, 1, 15], type: 'BOOST' },
        { x: 0, y: 0.1, z: -60, size: [10, 1, 15], type: 'BOOST' }
      ]
    }
  ]
};