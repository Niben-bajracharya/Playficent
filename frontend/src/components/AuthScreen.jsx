import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    let result;
    if (isLogin) {
      result = await login(username, password);
    } else {
      result = await register(username, password);
    }

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen bg-black text-neonGreen font-press-start flex flex-col items-center justify-center crt-overlay relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-neonGreen rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-neonBlue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 border-2 border-neonPink rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Title with enhanced styling */}
        <div className="mb-16 text-center">
          <h1 className="mb-2 animate-pulse font-black" style={{ 
            fontSize: 'clamp(16px, 3.5vw, 26px)',
            textShadow: '0 0 20px #39FF14, 0 0 40px #39FF14, 0 0 60px #39FF14' 
          }}>
            TYPE TO SURVIVE
          </h1>
          <p className="text-neonBlue tracking-widest animate-bounce" style={{ 
            fontSize: 'clamp(6px, 1vw, 8px)',
            textShadow: '0 0 10px #00D9FF' 
          }}>
            MASTER THE TERMINAL
          </p>
        </div>

        {/* Form container with enhanced styling */}
        <div className="relative w-96">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-neonGreen to-neonBlue rounded-lg blur opacity-50 animate-pulse"></div>
          
          {/* Main form box */}
          <div className="relative bg-black border-3 border-neonGreen p-10 rounded-lg" style={{ 
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.5), inset 0 0 20px rgba(57, 255, 20, 0.1)' 
          }}>
            {/* Form title with accent */}
            <div className="mb-8">
              <h2 className="text-center mb-2" style={{ 
                fontSize: 'clamp(11px, 2.2vw, 15px)',
                textShadow: '0 0 10px #39FF14' 
              }}>
                {isLogin ? 'ENTER SYSTEM' : 'NEW PLAYER'}
              </h2>
              <div className="h-1 w-12 bg-gradient-to-r from-neonGreen to-neonBlue mx-auto rounded-full"></div>
            </div>

            {/* Error display with enhanced styling */}
            {error && (
              <div className="bg-red-500/20 border-2 border-red-500 text-red-300 mb-6 p-4 rounded text-center animate-pulse" style={{ fontSize: 'clamp(7px, 1vw, 9px)' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Username input with icon */}
              <div>
                <label className="text-gray-400 mb-2 block" style={{ fontSize: 'clamp(6px, 1vw, 8px)' }}>USERNAME</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-neonGreen">▶</span>
                  <input 
                    type="text" 
                    placeholder="USERNAME" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="w-full bg-black/50 border-2 border-neonGreen p-3 pl-8 outline-none text-neonGreen placeholder-gray-600 transition-all focus:bg-black/80 focus:border-neonBlue focus:box-shadow-lg rounded"
                    style={{ 
                      boxShadow: 'inset 0 0 5px rgba(57, 255, 20, 0.1)' 
                    }}
                  />
                </div>
              </div>

              {/* Password input with icon */}
              <div>
                <label className="text-gray-400 mb-2 block" style={{ fontSize: 'clamp(6px, 1vw, 8px)' }}>PASSWORD</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-neonGreen">▶</span>
                  <input 
                    type="password" 
                    placeholder="PASSWORD" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-black/50 border-2 border-neonGreen p-3 pl-8 outline-none text-neonGreen placeholder-gray-600 transition-all focus:bg-black/80 focus:border-neonBlue focus:box-shadow-lg rounded tracking-widest"
                    style={{ 
                      boxShadow: 'inset 0 0 5px rgba(57, 255, 20, 0.1)' 
                    }}
                  />
                </div>
              </div>
              
              {/* Submit button with enhanced effects */}
              <button 
                type="submit" 
                disabled={loading}
                className="relative mt-4 py-4 px-6 font-bold transition-all duration-200 rounded overflow-hidden group disabled:opacity-50"
                style={{
                  fontSize: 'clamp(9px, 1.8vw, 13px)',
                  border: '3px solid #39FF14',
                  boxShadow: loading ? '0 0 20px #00D9FF' : '0 0 15px #39FF14',
                  color: '#39FF14'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 0 30px #39FF14, 0 0 50px rgba(57, 255, 20, 0.5)';
                    e.target.style.backgroundColor = 'rgba(57, 255, 20, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 0 15px #39FF14';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span className="relative z-10">
                  {loading ? '⟳ PROCESSING...' : (isLogin ? '⏵ ENTER GAME' : '⏵ JOIN FLEET')}
                </span>
              </button>
            </form>

            {/* Toggle button with improved styling */}
            <div className="mt-8 pt-6 border-t border-neonGreen/30">
              <p className="text-center text-gray-400 mb-4" style={{ fontSize: 'clamp(6px, 1vw, 8px)' }}>
                {isLogin ? "NEW PLAYER?" : "RETURNING PLAYER?"} 
              </p>
              <button 
                type="button" 
                className="w-full py-3 px-4 border-2 border-neonBlue text-neonBlue hover:bg-neonBlue hover:text-black transition-all rounded font-bold"
                style={{
                  fontSize: 'clamp(8px, 1.3vw, 11px)',
                  boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)'
                }}
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
              >
                {isLogin ? "→ CREATE ACCOUNT" : "→ LOGIN"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer text with styling */}
        <p className="mt-12 text-center text-gray-500" style={{ fontSize: 'clamp(6px, 1vw, 8px)' }}>
          <span className="animate-pulse">▪</span> SECURE CONNECTION <span className="animate-pulse">▪</span>
        </p>
      </div>
    </div>
  );
}
