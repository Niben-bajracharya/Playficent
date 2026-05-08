import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8000/api';

export default function UserDashboard({ onPlayGame, onLogout, refreshTrigger, onResumeGame }) {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('all');
  const [leaderboardDifficulty, setLeaderboardDifficulty] = useState('all');
  const [userStats, setUserStats] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || ''
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchLeaderboard();
    } else if (activeTab === 'personal') {
      fetchUserStats();
    }
  }, [activeTab, leaderboardPeriod, leaderboardDifficulty]);

  useEffect(() => {
    if (activeTab === 'stats' && refreshTrigger > 0) {
      fetchLeaderboard();
    } else if (activeTab === 'personal' && refreshTrigger > 0) {
      fetchUserStats();
    }
  }, [refreshTrigger]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('period', leaderboardPeriod);
      params.append('difficulty', leaderboardDifficulty);
      params.append('limit', 10);
      
      const res = await fetch(`${API_BASE}/leaderboard?${params}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (e) {
      console.error('Failed to fetch leaderboard', e);
    }
    setLoading(false);
  };

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/statistics`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUserStats(data);
      }
    } catch (e) {
      console.error('Failed to fetch user statistics', e);
    }
    setLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage('Image must be smaller than 2MB');
        setMessageType('error');
        return;
      }

      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setMessage('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Add avatar to the update request if one is selected or cleared
    const updateData = { ...formData };
    if (avatarPreview !== user?.avatar_url) {
      // Send base64 if selected, or empty string if removed
      updateData.avatar_url = avatarPreview || '';
    }

    const result = await updateProfile(updateData);
    setLoading(false);

    if (result.success) {
      setMessageType('success');
      setMessage('Profile updated successfully!');
      setIsEditMode(false);
      setFormData({
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        bio: user?.bio || ''
      });
      // Keep the avatar preview if it was just updated
      if (updateData.avatar_url !== undefined) {
        setAvatarPreview(updateData.avatar_url);
      }
    } else {
      setMessageType('error');
      setMessage(result.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessageType('error');
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await updateProfile({ password: passwordData.new_password });
    setLoading(false);

    if (result.success) {
      setMessageType('success');
      setMessage('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } else {
      setMessageType('error');
      setMessage(result.error || 'Failed to change password');
    }
  };

  return (
    <div className="w-screen h-screen bg-black text-neonGreen font-press-start overflow-auto">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-black border-b-2 border-neonGreen py-4 px-8 flex justify-between items-center" style={{ boxShadow: '0 0 15px rgba(57, 255, 20, 0.3)' }}>
          <h1 style={{ 
            fontSize: 'clamp(16px, 3vw, 24px)',
            textShadow: '0 0 10px #39FF14' 
          }}>USER DASHBOARD</h1>
          <div className="flex gap-4">
            {onResumeGame && (
              <button 
                onClick={onResumeGame}
                className="border-2 border-neonYellow px-4 py-2 hover:bg-neonYellow hover:text-black transition-all text-sm text-neonYellow font-bold animate-pulse"
                style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}
              >
                ▶ RESUME GAME
              </button>
            )}
            <button 
              onClick={onPlayGame}
              className="border-2 border-neonGreen px-4 py-2 hover:bg-neonGreen hover:text-black transition-all text-sm"
              style={{ boxShadow: '0 0 10px #39FF14' }}
            >
              HOME
            </button>
            <button 
              onClick={onLogout}
              className="border-2 border-red-500 px-4 py-2 hover:bg-red-500 hover:text-black transition-all text-sm text-red-500"
              style={{ boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)' }}
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-48 border-r-2 border-neonGreen p-4" style={{ boxShadow: 'inset -10px 0 15px rgba(57, 255, 20, 0.1)' }}>
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 border-l-4 transition-all ${
                  activeTab === 'profile'
                    ? 'border-neonGreen bg-neonGreen/10'
                    : 'border-transparent hover:border-neonGreen'
                }`}
              >
                PROFILE
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-2 border-l-4 transition-all ${
                  activeTab === 'security'
                    ? 'border-neonGreen bg-neonGreen/10'
                    : 'border-transparent hover:border-neonGreen'
                }`}
              >
                SECURITY
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full text-left px-4 py-2 border-l-4 transition-all ${
                  activeTab === 'stats'
                    ? 'border-neonGreen bg-neonGreen/10'
                    : 'border-transparent hover:border-neonGreen'
                }`}
              >
                STATS
              </button>
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full text-left px-4 py-2 border-l-4 transition-all ${
                  activeTab === 'personal'
                    ? 'border-neonGreen bg-neonGreen/10'
                    : 'border-transparent hover:border-neonGreen'
                }`}
              >
                PERSONAL BESTS
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            {message && (
              <div className={`mb-6 p-4 border-2 rounded ${
                messageType === 'success'
                  ? 'border-neonGreen text-neonGreen'
                  : 'border-red-500 text-red-500'
              }`}>
                {message}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <h2 style={{ 
                  fontSize: 'clamp(11px, 2.3vw, 16px)',
                  textShadow: '0 0 10px #39FF14',
                  marginBottom: '1.5rem'
                }}>
                  {isEditMode ? 'EDIT PROFILE' : 'YOUR PROFILE'}
                </h2>

                <div className="border-2 border-neonGreen p-6 mb-6" style={{ boxShadow: 'inset 0 0 15px rgba(57, 255, 20, 0.1)' }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">USERNAME</label>
                      <input
                        type="text"
                        value={user?.username || ''}
                        disabled
                        className="w-full bg-black border-b-2 border-neonGreen/50 p-2 outline-none"
                      />
                    </div>

                    {isEditMode ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-2">FIRST NAME</label>
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleFormChange}
                              className="w-full bg-black border-b-2 border-neonGreen p-2 outline-none text-neonGreen"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-2">LAST NAME</label>
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleFormChange}
                              className="w-full bg-black border-b-2 border-neonGreen p-2 outline-none text-neonGreen"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm mb-2">EMAIL</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            className="w-full bg-black border-b-2 border-neonGreen p-2 outline-none text-neonGreen"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-2">BIO</label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleFormChange}
                            rows="4"
                            className="w-full bg-black border-2 border-neonGreen p-2 outline-none text-neonGreen"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-3">PROFILE PICTURE</label>
                          
                          {/* Avatar Preview */}
                          <div className="mb-4 flex justify-center">
                            {avatarPreview ? (
                              <div className="relative">
                                <img 
                                  src={avatarPreview} 
                                  alt="Avatar Preview" 
                                  className="w-32 h-32 border-2 border-neonGreen rounded object-cover"
                                  style={{ boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)' }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setAvatarPreview(null)}
                                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="w-32 h-32 border-2 border-dashed border-neonGreen/50 rounded flex items-center justify-center text-gray-500 text-xs text-center">
                                No image selected
                              </div>
                            )}
                          </div>

                          {/* File Upload Input */}
                          <label className="block">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                            <div className="border-2 border-dashed border-neonGreen p-4 rounded cursor-pointer text-center hover:bg-neonGreen/5 transition-all">
                              <span className="text-sm text-neonGreen">📁 CLICK TO UPLOAD IMAGE</span>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (max 2MB)</p>
                            </div>
                          </label>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="flex-1 border-2 border-neonGreen px-4 py-2 hover:bg-neonGreen hover:text-black transition-all disabled:opacity-50"
                            style={{ boxShadow: '0 0 10px #39FF14' }}
                          >
                            {loading ? 'SAVING...' : 'SAVE CHANGES'}
                          </button>
                          <button
                            onClick={() => setIsEditMode(false)}
                            className="flex-1 border-2 border-gray-500 px-4 py-2 hover:border-neonGreen transition-all text-gray-500 hover:text-neonGreen"
                          >
                            CANCEL
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-gray-500 mb-1">FIRST NAME</span>
                            <span className="block text-neonGreen">{user?.first_name || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="block text-gray-500 mb-1">LAST NAME</span>
                            <span className="block text-neonGreen">{user?.last_name || 'Not set'}</span>
                          </div>
                        </div>

                        <div>
                          <span className="block text-gray-500 mb-1">EMAIL</span>
                          <span className="block text-neonGreen">{user?.email || 'Not set'}</span>
                        </div>

                        {avatarPreview && (
                          <div className="flex flex-col items-center gap-2">
                            <span className="block text-gray-500 text-sm">PROFILE PICTURE</span>
                            <img 
                              src={avatarPreview} 
                              alt="Your Avatar" 
                              className="w-32 h-32 border-2 border-neonGreen rounded object-cover"
                              style={{ boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)' }}
                            />
                          </div>
                        )}

                        <div>
                          <span className="block text-gray-500 mb-1">BIO</span>
                          <span className="block text-neonGreen">{user?.bio || 'No bio added'}</span>
                        </div>

                        <div>
                          <span className="block text-gray-500 mb-1">ACCOUNTS SINCE</span>
                          <span className="block text-neonGreen text-xs">
                            {new Date(user?.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <button
                          onClick={() => setIsEditMode(true)}
                          className="mt-4 w-full border-2 border-neonGreen px-4 py-2 hover:bg-neonGreen hover:text-black transition-all"
                          style={{ boxShadow: '0 0 10px #39FF14' }}
                        >
                          EDIT PROFILE
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <h2 style={{
                  fontSize: 'clamp(11px, 2.3vw, 16px)',
                  textShadow: '0 0 10px #39FF14',
                  marginBottom: '1.5rem'
                }}>
                  CHANGE PASSWORD
                </h2>

                <div className="border-2 border-neonGreen p-6" style={{ boxShadow: 'inset 0 0 15px rgba(57, 255, 20, 0.1)' }}>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">NEW PASSWORD</label>
                      <input
                        type="password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        className="w-full bg-black border-b-2 border-neonGreen p-2 outline-none text-neonGreen"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">CONFIRM PASSWORD</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        className="w-full bg-black border-b-2 border-neonGreen p-2 outline-none text-neonGreen"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full border-2 border-neonGreen px-4 py-2 hover:bg-neonGreen hover:text-black transition-all disabled:opacity-50 mt-6"
                      style={{ boxShadow: '0 0 10px #39FF14' }}
                    >
                      {loading ? 'UPDATING...' : 'CHANGE PASSWORD'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* STATS TAB */}
            {activeTab === 'stats' && (
              <div>
                <h2 className="text-2xl mb-6" style={{ textShadow: '0 0 10px #39FF14' }}>
                  LEADERBOARD
                </h2>

                {/* Period Filter */}
                <div className="mb-6 p-4 border-2 border-neonGreen bg-neonGreen/5 space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">TIME PERIOD</label>
                    <div className="flex gap-2">
                      {['all', 'month', 'week', 'today'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setLeaderboardPeriod(period)}
                          className={`px-4 py-2 border-2 text-xs transition-all ${
                            leaderboardPeriod === period
                              ? 'border-neonGreen bg-neonGreen/20 text-neonGreen'
                              : 'border-neonGreen/50 text-gray-400 hover:border-neonGreen'
                          }`}
                        >
                          {period === 'all' ? 'All Time' : period === 'month' ? 'Last 30 Days' : period === 'week' ? 'Last 7 Days' : 'Today'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">DIFFICULTY</label>
                    <div className="flex gap-2">
                      {['all', 'easy', 'normal', 'hard', 'insane'].map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => setLeaderboardDifficulty(difficulty)}
                          className={`px-4 py-2 border-2 text-xs transition-all capitalize ${
                            leaderboardDifficulty === difficulty
                              ? 'border-neonGreen bg-neonGreen/20 text-neonGreen'
                              : 'border-neonGreen/50 text-gray-400 hover:border-neonGreen'
                          }`}
                        >
                          {difficulty === 'all' ? 'All' : difficulty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center text-gray-500">Loading leaderboard...</div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center text-gray-500">No scores yet for this period</div>
                ) : (
                  <div className="border-2 border-neonGreen overflow-x-auto" style={{ boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)' }}>
                    <table className="w-full text-xs">
                      <thead className="bg-neonGreen/10 border-b-2 border-neonGreen">
                        <tr>
                          <th className="p-3 text-left">RANK</th>
                          <th className="p-3 text-left">USERNAME</th>
                          <th className="p-3 text-center">SCORE</th>
                          <th className="p-3 text-center">WPM</th>
                          <th className="p-3 text-center">DIFFICULTY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((entry, idx) => (
                          <tr key={entry.id} className={`border-b border-neonGreen/30 ${idx % 2 === 0 ? 'bg-black/50' : ''}`}>
                            <td className="p-3 text-neonYellow font-bold">#{idx + 1}</td>
                            <td className="p-3">{entry.username}</td>
                            <td className="p-3 text-center font-bold text-neonGreen">{entry.score}</td>
                            <td className="p-3 text-center">{entry.wpm.toFixed(2)}</td>
                            <td className="p-3 text-center font-bold capitalize">
                              <span className={`
                                ${entry.difficulty === 'easy' && 'text-green-500'}
                                ${entry.difficulty === 'normal' && 'text-neonGreen'}
                                ${entry.difficulty === 'hard' && 'text-yellow-500'}
                                ${entry.difficulty === 'insane' && 'text-red-500'}
                              `}>
                                {entry.difficulty}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PERSONAL BESTS TAB */}
            {activeTab === 'personal' && (
              <div>
                <h2 style={{ 
                  fontSize: 'clamp(11px, 2.3vw, 16px)',
                  textShadow: '0 0 10px #39FF14',
                  marginBottom: '1.5rem'
                }}>
                  PERSONAL BESTS
                </h2>

                {loading ? (
                  <div className="text-center text-gray-500">Loading statistics...</div>
                ) : !userStats ? (
                  <div className="text-center text-gray-500">No data available</div>
                ) : (
                  <div className="space-y-6">
                    {/* Overall Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="border-2 border-neonGreen p-6" style={{ boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)' }}>
                        <div className="text-xs text-gray-400 mb-2">TOTAL GAMES</div>
                        <div style={{
                          fontSize: 'clamp(12px, 3vw, 22px)',
                          color: '#39FF14',
                          fontWeight: 'bold'
                        }}>{userStats.total_games}</div>
                      </div>
                      <div className="border-2 border-neonBlue p-6" style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)' }}>
                        <div className="text-xs text-gray-400 mb-2">BEST SCORE</div>
                        <div style={{
                          fontSize: 'clamp(12px, 3vw, 22px)',
                          color: '#00D9FF',
                          fontWeight: 'bold'
                        }}>{userStats.best_overall_score}</div>
                      </div>
                      <div className="border-2 border-neonYellow p-6" style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)' }}>
                        <div className="text-xs text-gray-400 mb-2">BEST WPM</div>
                        <div style={{
                          fontSize: 'clamp(12px, 3vw, 22px)',
                          color: '#FFD700',
                          fontWeight: 'bold'
                        }}>{userStats.best_overall_wpm.toFixed(1)}</div>
                      </div>
                      <div className="border-2 border-neonPink p-6" style={{ boxShadow: '0 0 15px rgba(255, 16, 240, 0.2)' }}>
                        <div className="text-xs text-gray-400 mb-2">AVG SCORE</div>
                        <div style={{
                          fontSize: 'clamp(12px, 3vw, 22px)',
                          color: '#FF69B4',
                          fontWeight: 'bold'
                        }}>{Math.round(userStats.average_score)}</div>
                      </div>
                    </div>
                    {/* Per Difficulty Stats */}
                    <div>
                      <h3 className="text-xl mb-4" style={{ textShadow: '0 0 8px #39FF14' }}>BEST BY DIFFICULTY</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {userStats.easy && (
                          <div className="border-2 border-green-500 p-4" style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)' }}>
                            <div className="text-green-500 font-bold mb-2">EASY</div>
                            <div className="text-sm text-gray-400 mb-1">Best Score: <span className="text-green-500 font-bold">{userStats.easy.best_score}</span></div>
                            <div className="text-sm text-gray-400 mb-1">Best WPM: <span className="text-green-500 font-bold">{userStats.easy.best_wpm.toFixed(1)}</span></div>
                            <div className="text-sm text-gray-400">Games: <span className="text-green-500 font-bold">{userStats.easy.games_played}</span></div>
                          </div>
                        )}
                        {userStats.normal && (
                          <div className="border-2 border-neonGreen p-4" style={{ boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)' }}>
                            <div className="text-neonGreen font-bold mb-2">NORMAL</div>
                            <div className="text-sm text-gray-400 mb-1">Best Score: <span className="text-neonGreen font-bold">{userStats.normal.best_score}</span></div>
                            <div className="text-sm text-gray-400 mb-1">Best WPM: <span className="text-neonGreen font-bold">{userStats.normal.best_wpm.toFixed(1)}</span></div>
                            <div className="text-sm text-gray-400">Games: <span className="text-neonGreen font-bold">{userStats.normal.games_played}</span></div>
                          </div>
                        )}
                        {userStats.hard && (
                          <div className="border-2 border-yellow-500 p-4" style={{ boxShadow: '0 0 10px rgba(234, 179, 8, 0.3)' }}>
                            <div className="text-yellow-500 font-bold mb-2">HARD</div>
                            <div className="text-sm text-gray-400 mb-1">Best Score: <span className="text-yellow-500 font-bold">{userStats.hard.best_score}</span></div>
                            <div className="text-sm text-gray-400 mb-1">Best WPM: <span className="text-yellow-500 font-bold">{userStats.hard.best_wpm.toFixed(1)}</span></div>
                            <div className="text-sm text-gray-400">Games: <span className="text-yellow-500 font-bold">{userStats.hard.games_played}</span></div>
                          </div>
                        )}
                        {userStats.insane && (
                          <div className="border-2 border-red-500 p-4" style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)' }}>
                            <div className="text-red-500 font-bold mb-2">INSANE</div>
                            <div className="text-sm text-gray-400 mb-1">Best Score: <span className="text-red-500 font-bold">{userStats.insane.best_score}</span></div>
                            <div className="text-sm text-gray-400 mb-1">Best WPM: <span className="text-red-500 font-bold">{userStats.insane.best_wpm.toFixed(1)}</span></div>
                            <div className="text-sm text-gray-400">Games: <span className="text-red-500 font-bold">{userStats.insane.games_played}</span></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
