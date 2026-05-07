import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function GameMenu({ onStartGame, onGoToDashboard, onLogout }) {
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');

  const difficulties = {
    easy: {
      label: 'EASY',
      description: 'Slower words, more time to react',
      color: '#39FF14',
      glow: 'rgba(57, 255, 20, 0.3)',
      settings: { fallSpeed: 0.3, spawnInterval: 3500 }
    },
    normal: {
      label: 'NORMAL',
      description: 'Standard difficulty, balanced gameplay',
      color: '#00D9FF',
      glow: 'rgba(0, 217, 255, 0.3)',
      settings: { fallSpeed: 0.6, spawnInterval: 2500 }
    },
    hard: {
      label: 'HARD',
      description: 'Faster words, challenging experience',
      color: '#FFD700',
      glow: 'rgba(255, 215, 0, 0.3)',
      settings: { fallSpeed: 1.0, spawnInterval: 1800 }
    },
    insane: {
      label: 'INSANE',
      description: 'Extreme speed, for the brave',
      color: '#FF0000',
      glow: 'rgba(255, 0, 0, 0.3)',
      settings: { fallSpeed: 1.5, spawnInterval: 1200 }
    }
  };

  const handleStartGame = () => {
    const difficultySettings = difficulties[selectedDifficulty].settings;
    onStartGame(selectedDifficulty, difficultySettings);
  };

  return (
    <div className="w-screen h-screen bg-black text-neonGreen font-press-start overflow-hidden relative flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 border border-neonGreen rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-56 h-56 border border-neonBlue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-3xl px-8">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="font-black mb-3 animate-pulse" style={{ 
            fontSize: 'clamp(16px, 4vw, 24px)',
            textShadow: '0 0 30px #39FF14, 0 0 60px #39FF14' 
          }}>
            WELCOME
          </h1>
          <p className="text-neonBlue font-bold" style={{ 
            fontSize: 'clamp(10px, 2vw, 14px)',
            textShadow: '0 0 15px #00D9FF' 
          }}>
            {user.username.toUpperCase()}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-neonGreen to-neonBlue mx-auto rounded-full mt-4"></div>
        </div>

        {/* Difficulty Selection Container */}
        <div className="w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-neonGreen to-neonBlue rounded-lg blur opacity-30 animate-pulse" style={{ left: '2rem', right: '2rem', top: '50%', height: '400px' }}></div>
          <div className="relative bg-black border-3 border-neonGreen p-12 rounded-lg" style={{ boxShadow: '0 0 30px rgba(57, 255, 20, 0.4), inset 0 0 20px rgba(57, 255, 20, 0.1)' }}>
            <h2 className="mb-10 text-center font-bold" style={{ 
              fontSize: 'clamp(12px, 3vw, 18px)',
              textShadow: '0 0 10px #39FF14' 
            }}>
              ⚙️ SELECT DIFFICULTY
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {Object.entries(difficulties).map(([key, diff]) => {
                const isSelected = selectedDifficulty === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className="relative group p-6 rounded transition-all duration-300 overflow-hidden"
                    style={{
                      border: `3px solid ${isSelected ? diff.color : '#444444'}`,
                      backgroundColor: isSelected ? diff.glow : 'rgba(0, 0, 0, 0.7)',
                      boxShadow: isSelected ? `0 0 25px ${diff.glow}, inset 0 0 10px ${diff.glow}` : 'none',
                      color: isSelected ? diff.color : '#888888'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = diff.color;
                        e.currentTarget.style.boxShadow = `0 0 15px rgba(${diff.color === '#39FF14' ? '57, 255, 20' : diff.color === '#00D9FF' ? '0, 217, 255' : diff.color === '#FFD700' ? '255, 215, 0' : '255, 0, 0'}, 0.5)`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#444444';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div className="font-bold mb-2" style={{ fontSize: 'clamp(9px, 1.8vw, 13px)' }}>{diff.label}</div>
                    <div className="leading-relaxed mb-3" style={{ fontSize: 'clamp(7px, 0.9vw, 9px)' }}>{diff.description}</div>
                    {isSelected && (
                      <div className="text-green-300 mt-3 pt-3 border-t border-current" style={{ fontSize: 'clamp(7px, 0.9vw, 9px)' }}>
                        ✓ SELECTED
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Difficulty Info */}
            <div className="border-t-2 border-neonGreen/50 pt-6 text-center mb-8">
              <div className="text-gray-300 space-y-1" style={{ fontSize: 'clamp(8px, 1.3vw, 10px)' }}>
                <p>⚡ FALL SPEED: <span className="text-neonYellow font-bold">{difficulties[selectedDifficulty].settings.fallSpeed}x</span></p>
                <p>⏱️ SPAWN INTERVAL: <span className="text-neonYellow font-bold">{difficulties[selectedDifficulty].settings.spawnInterval}ms</span></p>
              </div>
            </div>

            {/* Start Game Button */}
            <button
              onClick={handleStartGame}
              className="w-full py-5 px-8 font-bold rounded transition-all duration-300 relative overflow-hidden group"
              style={{
                fontSize: 'clamp(10px, 2vw, 14px)',
                border: '3px solid #39FF14',
                color: '#39FF14',
                boxShadow: '0 0 20px #39FF14',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 40px #39FF14, 0 0 60px rgba(57, 255, 20, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 0 20px #39FF14';
              }}
            >
              ▶ START GAME
            </button>
          </div>
        </div>

        {/* Other Options */}
        <div className="flex gap-6 justify-center">
          <button
            onClick={onGoToDashboard}
            className="px-8 py-3 border-3 border-neonBlue text-neonBlue rounded font-bold transition-all duration-300"
            style={{ 
              fontSize: 'clamp(8px, 1.3vw, 11px)',
              boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 217, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 217, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.3)';
            }}
          >
            📊 DASHBOARD
          </button>
          <button
            onClick={onLogout}
            className="px-8 py-3 border-3 border-red-500 text-red-500 rounded font-bold transition-all duration-300"
            style={{ 
              fontSize: 'clamp(8px, 1.3vw, 11px)',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.3)';
            }}
          >
            🚪 LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}
