export const LEVEL_7 = {
  id: 'level_7',
  name: 'Decisiones Conscientes',
  difficulty: 'medium',
  segments: [
    { type: 'split_path' },
    { type: 'step_sequence' },
    {
      type: 'custom_grid',
      name: 'Selección de Carril',
      length: 100,
      grid: [
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 0],
        [1, 1, 1],
        [1, 0, 1]
      ]
    },
    {
      name: 'Estación Doble',
      exitPoint: { x: 0, y: 0, z: -80 },
      obstacles: [
        // Plataforma base
        { x: 0, y: -1, z: -40, size: [20, 2, 80], type: 'NORMAL' },
        // Suministros a ambos lados
        { x: -15, y: 0.1, z: -30, size: [8, 2, 12], type: 'SUPPLIES' },
        { x: 15, y: 0.1, z: -30, size: [8, 2, 12], type: 'SUPPLIES' }
      ]
    }
  ]
};