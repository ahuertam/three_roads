import React, { useState } from 'react';
import useGameStore from '../store/gameStore';
import { LEVELS } from '../levels/index';

const LEVELS_PER_PAGE = 6;

function LevelSelector() {
  const { gameState, startLevel, highScores, bestTimes } = useGameStore();
  const [currentPage, setCurrentPage] = useState(0);
  
  if (gameState !== 'menu') return null;

  const totalPages = Math.ceil(LEVELS.length / LEVELS_PER_PAGE);
  const startIdx = currentPage * LEVELS_PER_PAGE;
  const endIdx = Math.min(startIdx + LEVELS_PER_PAGE, LEVELS.length);
  const currentLevels = LEVELS.slice(startIdx, endIdx);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      pointerEvents: 'auto'
    }}>
      <div style={{
        background: 'rgba(20, 20, 20, 0.95)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        border: '3px solid #00ff00',
        boxShadow: '0 0 30px #00ff0080',
        maxWidth: '650px',
        width: '90%'
      }}>
        <h1 style={{
          margin: '0 0 10px 0',
          color: '#00ff00',
          fontSize: '48px',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          textShadow: '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.4)',
          fontWeight: 'bold'
        }}>Three-Roads</h1>
        
        <p style={{
          margin: '0 0 20px 0',
          color: '#87CEEB',
          fontSize: '14px',
          fontStyle: 'italic'
        }}>by Alejandro Huerta</p>
        
        <h2 style={{
          margin: '0 0 20px 0',
          color: '#00ff00',
          fontSize: '24px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>Selecciona nivel</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {currentLevels.map((lvl, idx) => {
            const globalIdx = startIdx + idx;
            return (
              <button
                key={lvl.id || globalIdx}
                onClick={() => startLevel(globalIdx)}
                style={{
                  backgroundColor: '#111',
                  color: '#fff',
                  border: '2px solid #444',
                  borderRadius: '10px',
                  padding: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#222';
                  e.currentTarget.style.borderColor = '#00ff00';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#111';
                  e.currentTarget.style.borderColor = '#444';
                }}
              >
                <div style={{
                  fontSize: '14px',
                  color: '#00ff00',
                  marginBottom: '6px',
                  fontWeight: 'bold'
                }}>LEVEL {globalIdx + 1}</div>
                <div style={{ fontSize: '18px' }}>{lvl.name || 'Sin título'}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  High Score: {highScores[lvl.id] || 0}m
                </div>
                <div style={{ fontSize: '12px', color: '#87CEEB', marginTop: '2px' }}>
                  Mejor: {bestTimes[lvl.id] ? (() => {
                    const seconds = bestTimes[lvl.id];
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    const ms = Math.floor((seconds % 1) * 100);
                    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
                  })() : 'N/A'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginTop: '20px'
        }}>
          {/* Previous Button */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            style={{
              backgroundColor: currentPage === 0 ? '#333' : '#111',
              color: currentPage === 0 ? '#666' : '#00ff00',
              border: `2px solid ${currentPage === 0 ? '#555' : '#00ff00'}`,
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              fontSize: '20px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              opacity: currentPage === 0 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (currentPage > 0) {
                e.currentTarget.style.backgroundColor = '#00ff00';
                e.currentTarget.style.color = '#000';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage > 0) {
                e.currentTarget.style.backgroundColor = '#111';
                e.currentTarget.style.color = '#00ff00';
              }
            }}
          >
            ◀
          </button>

          {/* Page Indicator */}
          <div style={{
            color: '#00ff00',
            fontSize: '18px',
            fontWeight: 'bold',
            minWidth: '80px'
          }}>
            {currentPage + 1} / {totalPages}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            style={{
              backgroundColor: currentPage >= totalPages - 1 ? '#333' : '#111',
              color: currentPage >= totalPages - 1 ? '#666' : '#00ff00',
              border: `2px solid ${currentPage >= totalPages - 1 ? '#555' : '#00ff00'}`,
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
              fontSize: '20px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              opacity: currentPage >= totalPages - 1 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (currentPage < totalPages - 1) {
                e.currentTarget.style.backgroundColor = '#00ff00';
                e.currentTarget.style.color = '#000';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage < totalPages - 1) {
                e.currentTarget.style.backgroundColor = '#111';
                e.currentTarget.style.color = '#00ff00';
              }
            }}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default LevelSelector;