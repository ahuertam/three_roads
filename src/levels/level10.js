export const LEVEL_10 = {
  id: 'level_10',
  name: 'Gran Mezcla',
  difficulty: 'hard',
  segments: [
    { type: 'step_sequence' },
    { type: 'split_path' },
    { type: 'small_gap' },
    { type: 'block_field' },
    { type: 'hazard_road' },
    { type: 'straight_road' },
    {
      type: 'custom_grid',
      name: 'Simetría Final',
      length: 90,
      grid: [
        [1, 1, 1],
        [0, 1, 0],
        [1, 1, 1]
      ]
    }
  ]
};