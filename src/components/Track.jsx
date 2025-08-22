import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import useGameStore from '../store/gameStore';

function Track() {
  const { speed, gameState } = useGameStore();
  const trackRef = useRef();
  
  // Generar segmentos de pista sin agujeros
  const trackSegments = useMemo(() => {
    const segments = [];
    
    for (let i = 0; i < 50; i++) {
      const segment = {
        id: i,
        position: [0, 0, -i * 4],
        tiles: [] // Array de tiles individuales
      };
      
      // Crear tiles individuales para cada segmento (3 carriles) - todos normales
      for (let lane = -1; lane <= 1; lane++) {
        segment.tiles.push({
          lane: lane,
          position: [lane * 2, 0, -i * 4],
          isHole: false,
          color: i % 2 === 0 ? '#7B68EE' : '#9370DB' // Colores más brillantes (púrpura)
        });
      }
      
      segments.push(segment);
    }
    return segments;
  }, []);
  
  useFrame(() => {
    if (gameState === 'playing') {
      // Mover la pista hacia el jugador
      trackSegments.forEach((segment) => {
        segment.position[2] += speed;
        segment.tiles.forEach(tile => {
          tile.position[2] += speed;
        });
        
        // Reciclar segmentos que han pasado al jugador
        if (segment.position[2] > 10) {
          const offset = segment.position[2] - 10;
          segment.position[2] = -50 * 4 + offset;
          segment.tiles.forEach(tile => {
            tile.position[2] = -50 * 4 + offset;
          });
        }
      });
    }
  });
  
  return (
    <group ref={trackRef}>
      {/* Suelo base más brillante */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[20, 0.2, 200]} />
        <meshStandardMaterial color="#4169E1" emissive="#000033" /> {/* Azul real más brillante */}
      </mesh>
      
      {/* Renderizar tiles individuales - todos normales */}
      {trackSegments.map((segment) =>
        segment.tiles.map((tile, tileIndex) => {
          // Renderizar solo tiles normales (sin agujeros)
          return (
            <mesh key={`${segment.id}-${tileIndex}`} position={tile.position} receiveShadow>
              <Box args={[1.8, 0.1, 3]}>
                <meshStandardMaterial 
                  color={tile.color} 
                  emissive={tile.color === '#7B68EE' ? '#1a1a3a' : '#2a1a3a'}
                />
              </Box>
            </mesh>
          );
        })
      )}
      
      {/* Bordes de la pista más brillantes */}
      <mesh position={[-3.5, 0.2, 0]} receiveShadow>
        <boxGeometry args={[1, 0.4, 200]} />
        <meshStandardMaterial color="#FF6347" emissive="#330000" /> {/* Rojo tomate más brillante */}
      </mesh>
      <mesh position={[3.5, 0.2, 0]} receiveShadow>
        <boxGeometry args={[1, 0.4, 200]} />
        <meshStandardMaterial color="#FF6347" emissive="#330000" />
      </mesh>
      
      {/* Líneas divisorias entre carriles */}
      <mesh position={[-1, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.05, 200]} />
        <meshStandardMaterial color="#FFFF00" emissive="#333300" /> {/* Amarillo brillante */}
      </mesh>
      <mesh position={[1, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.05, 200]} />
        <meshStandardMaterial color="#FFFF00" emissive="#333300" />
      </mesh>
    </group>
  );
}

export default Track;