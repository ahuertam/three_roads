export const LEVEL_9 = {
  id: 'level_9',
  name: 'Islas con Ritmo',
  difficulty: 'hard',
  segments: [
    { type: 'island_hops' },
    { type: 'narrow_bridge' },
    {
      name: 'Tramo Resbaladizo',
      exitPoint: { x: 0, y: 0, z: -100 },
      obstacles: [
        { x: 0, y: -1, z: -20, size: [15, 2, 25], type: 'SLIPPERY' },
        { x: -15, y: -1, z: -55, size: [15, 2, 25], type: 'SLIPPERY' },
        { x: 15, y: -1, z: -90, size: [15, 2, 25], type: 'SLIPPERY' }
      ]
    }
  ]
};