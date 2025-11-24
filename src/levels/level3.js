export const LEVEL_3 = {
  id: 'level_3',
  name: 'Hazardous Steps',
  difficulty: 'medium',
  segments: [
    { type: 'straight_road' },
    { type: 'step_sequence' },
    { type: 'hazard_road' },
    { type: 'gentle_climb' },
    { type: 'hazard_road' },
    { 
      type: 'custom_grid',
      length: 100,
      grid: [
        [1, 1, 1],
        [3, 1, 3], // Fuego lados
        [1, 3, 1], // Fuego centro
        [3, 1, 3],
        [1, 1, 1]
      ]
    },
    { type: 'straight_road' }
  ]
};
