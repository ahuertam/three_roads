export const LEVEL_2 = {
  id: 'level_2',
  name: 'Split Paths',
  difficulty: 'medium',
  segments: [
    { type: 'straight_road' },
    { type: 'split_path' },
    { type: 'small_gap' },
    { type: 'split_path' },
    { type: 'gentle_climb' },
    { 
      type: 'custom_grid',
      length: 80,
      grid: [
        [1, 0, 1],
        [1, 0, 1],
        [0, 1, 0],
        [0, 1, 0],
        [1, 0, 1]
      ]
    },
    { type: 'straight_road' }
  ]
};
