export const LEVEL_8 = {
  id: 'level_8',
  name: 'Pista Peligrosa',
  difficulty: 'medium',
  segments: [
    { type: 'hazard_road' },
    { type: 'block_field' },
    {
      type: 'custom_grid',
      name: 'Líneas de Fuego',
      length: 120,
      grid: [
        [1, 3, 1],
        [0, 1, 0],
        [1, 3, 1],
        [1, 1, 1],
        [3, 1, 3],
        [1, 1, 1]
      ]
    },
    { type: 'gentle_climb' }
  ]
};