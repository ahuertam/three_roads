import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStore from '../store/gameStore';

function Track() {
  const { shipPosition } = useGameStore();
  
  // Solo 2 segmentos: actual y siguiente (en dirección Z negativa)
  const [trackSegments, setTrackSegments] = useState([
    { id: 0, position: [0, 0, 0], color: '#2a2a2a' },      // Plano actual
    { id: 1, position: [0, 0, -200], color: '#3a3a3a' }    // Plano siguiente (Z negativa)
  ]);
  
  const segmentColors = ['#2a2a2a', '#3a3a3a', '#404040', '#353535'];
  const nextId = useRef(2);
  
  useFrame(() => {
    const shipZ = shipPosition[2];
    
    setTrackSegments(currentSegments => {
      // Si la nave ha pasado la mitad del primer plano (Z < -100)
      // Nota: Como va hacia Z negativo, comparamos con menor que
      if (shipZ < currentSegments[0].position[2] - 100) {
        // El segundo plano se convierte en el primero
        const newCurrentPlane = currentSegments[1];
        
        // Crear un nuevo plano siguiente (más hacia Z negativo)
        const newNextPlane = {
          id: nextId.current,
          position: [0, 0, newCurrentPlane.position[2] - 200], // Z negativa
          color: segmentColors[nextId.current % segmentColors.length]
        };
        
        nextId.current++;
        
        return [newCurrentPlane, newNextPlane];
      }
      
      return currentSegments;
    });
  });
  
  const TrackSegment = ({ position, id, color }) => (
    <group key={`segment-${id}`} position={position}>
      {/* Plano principal */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 200]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.1} 
          roughness={0.8}
        />
      </mesh>
      
      {/* Línea central amarilla */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 200]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      
      {/* Líneas laterales rojas */}
      <mesh position={[-25, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 200]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      
      <mesh position={[25, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 200]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      
      {/* Marcador de inicio (línea verde) */}
      <mesh position={[0, 0.02, 95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 5]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#004400" 
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Marcador de final (línea azul) */}
      <mesh position={[0, 0.02, -95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 5]} />
        <meshStandardMaterial 
          color="#0088ff" 
          emissive="#002244" 
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Indicador del ID del segmento */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color={id % 2 === 0 ? '#ffffff' : '#ffff00'}
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Bordes laterales */}
      <mesh position={[-60, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 200]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      <mesh position={[60, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 200]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  );
  
  return (
    <group>
      {trackSegments.map((segment) => (
        <TrackSegment 
          key={`track-${segment.id}`}
          position={segment.position}
          id={segment.id}
          color={segment.color}
        />
      ))}
    </group>
  );
}

export default Track;