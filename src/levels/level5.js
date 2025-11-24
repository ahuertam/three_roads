export const LEVEL_5 = {
  id: 'level_5',
  name: 'The Final Run',
  difficulty: 'hard',
  segments: [
    { type: 'straight_road' },
    { type: 'narrow_bridge' },
    { type: 'island_hops' },
    { type: 'hazard_road' },
    { type: 'narrow_bridge' },
    { 
      type: 'custom_grid',
      length: 150,
      grid: [
        [1, 0, 1],
        [0, 1, 0],
        [2, 0, 2], // Muros
        [0, 3, 0], // Fuego
        [1, 0, 1],
        [0, 1, 0]
      ]
    },
    { type: 'straight_road' }
  ]
};
