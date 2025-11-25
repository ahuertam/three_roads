export const LEVEL_22 = {
  id: 'level_22',
  name: 'Skyroads Bonus',
  difficulty: 'extreme',
  segments: [
    // Intro: Build momentum
    { type: 'straight_road' },
    
    // Section 1: Rhythm Grid (Checkerboard)
    {
      type: 'custom_grid',
      name: 'Rhythm Check',
      length: 200,
      grid: [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
        [1, 1, 1], // Safe landing
        [0, 0, 0], // Gap
        [1, 1, 1]
      ]
    },

    // Section 2: Speed Boost
    {
      name: 'Velocity Zone',
      exitPoint: { x: 0, y: 0, z: -150 },
      obstacles: [
        { x: 0, y: -1, z: -75, size: [20, 2, 150], type: 'NORMAL' },
        { x: 0, y: 0.1, z: -30, size: [10, 1, 15], type: 'BOOST' },
        { x: -10, y: 0.1, z: -60, size: [10, 1, 15], type: 'BOOST' },
        { x: 10, y: 0.1, z: -90, size: [10, 1, 15], type: 'BOOST' },
        { x: 0, y: 0.1, z: -120, size: [10, 1, 15], type: 'BOOST' }
      ]
    },

    // Section 3: The Tunnel (Walls on sides)
    {
      type: 'custom_grid',
      name: 'The Tunnel',
      length: 250,
      grid: [
        [2, 1, 2],
        [2, 1, 2],
        [2, 0, 2], // Gap in middle
        [2, 1, 2],
        [2, 3, 2], // Hazard in middle
        [2, 1, 2],
        [2, 0, 2],
        [2, 1, 2],
        [2, 1, 2],
        [1, 1, 1]  // Exit
      ]
    },

    // Section 4: Hazards & Precision
    {
      name: 'Hazard Path',
      exitPoint: { x: 0, y: 0, z: -180 },
      obstacles: [
        { x: 0, y: -1, z: -90, size: [16, 2, 180], type: 'NORMAL' },
        { x: -5, y: -1, z: -30, size: [6, 2, 20], type: 'BURNING' },
        { x: 5, y: -1, z: -60, size: [6, 2, 20], type: 'SLIPPERY' },
        { x: 0, y: -1, z: -90, size: [16, 2, 20], type: 'STICKY' },
        { x: -5, y: -1, z: -120, size: [6, 2, 20], type: 'BURNING' },
        { x: 5, y: -1, z: -150, size: [6, 2, 20], type: 'SLIPPERY' }
      ]
    },

    // Finale: Complex Grid
    {
      type: 'custom_grid',
      name: 'Sky High Finale',
      length: 300,
      grid: [
        [1, 0, 1],
        [3, 1, 3],
        [0, 2, 0], // Jump over wall? Or land on it? 2 is elevated platform.
        [1, 0, 1],
        [2, 1, 2],
        [0, 3, 0],
        [1, 2, 1],
        [3, 0, 3],
        [1, 1, 1],
        [0, 0, 0], // Big gap
        [1, 1, 1]
      ]
    },
    
    { type: 'straight_road' }
  ]
};
