import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8000/api';

export default function AdminDashboard({ onLogout, onPlayGame, refreshTrigger, onResumeGame }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  // Leaderboard filters
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('all');
  const [leaderboardDifficulty, setLeaderboardDifficulty] = useState('all');
  const [leaderboardUsername, setLeaderboardUsername] = useState('');

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'leaderboard') fetchLeaderboard();
    if (activeTab === 'stats') fetchStats();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'leaderboard' && refreshTrigger > 0) {
      fetchLeaderboard();
    }
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
    }
    setLoading(false);
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('period', leaderboardPeriod);
      params.append('difficulty', leaderboardDifficulty);
      params.append('limit', 100);
      if (leaderboardUsername) {
        params.append('username', leaderboardUsername);
      }
      
      const res = await fetch(`${API_BASE}/admin/leaderboard?${params}`, {
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

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to fetch stats', e);
    }
    setLoading(false);
  };

  const handleEditUser = (u) => {
    setEditingUser(u.id);
    setEditForm({
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      role: u.role
    });
  };

  const handleSaveUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${editingUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setMessage('User updated successfully!');
        setMessageType('success');
        setEditingUser(null);
        fetchUsers();
      } else {
        const err = await res.json();
        setMessage(err.error || 'Failed to update user');
        setMessageType('error');
      }
    } catch (e) {
      setMessage(e.message);
      setMessageType('error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setMessage('User deleted successfully!');
        setMessageType('success');
        fetchUsers();
      } else {
        const err = await res.json();
        setMessage(err.error || 'Failed to delete user');
        setMessageType('error');
      }
    } catch (e) {
      setMessage(e.message);
      setMessageType('error');
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (!window.confirm('Are you sure you want to delete this score?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/admin/leaderboard/${scoreId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setMessage('Score deleted successfully!');
        setMessageType('success');
        fetchLeaderboard();
      } else {
        const err = await res.json();
        setMessage(err.error || 'Failed to delete score');
        setMessageType('error');
      }
    } catch (e) {
      setMessage(e.message);
      setMessageType('error');
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
          }}>ADMIN CONTROL PANEL</h1>
          <div className="flex gap-4">
            {onResumeGame && (
              <button 
                onClick={onResumeGame}
                className="border-2 border-neonYellow px-4 py-2 hover:bg-neonYellow hover:text-black transition-all text-neonYellow font-bold animate-pulse text-sm"
                style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}
              >
                ▶ RESUME GAME
              </button>
            )}
            <button 
              onClick={onPlayGame}
              className="border-2 border-neonGreen px-4 py-2 hover:bg-neonGreen hover:text-black transition-all"
              style={{ boxShadow: '0 0 10px #39FF14' }}
            >
              HOME
            </button>
            <button 
              onClick={onLogout}
              className="border-2 border-red-500 px-4 py-2 hover:bg-red-500 hover:text-black transition-all text-red-500"
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
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-2 border-l-4 transition-all text-sm ${
                  activeTab === 'users'
                    ? 'border-neonGreen bg-neonGreen/10'
                    : 'border-transparent hover:border-neonGreen'
                }`}
              >
                USERS
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`w-full text-left px-4 py-2 border-l-4 transition-all text-sm ${
                  activeTab === 'leaderboard'
                    ? 'border-neonGreen bg-neonGreen/10'
                    : 'border-transparent hover:border-neonGreen'
                }`}
              >
                LEADERBOARD
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full text-left px-4 py-2 border-l-4 transition-all text-sm ${
                  activeTab === 'stats'
                    ? 'border-neonGreen bg-neonGreen/10'
                    : 'border-transparent hover:border-neonGreen'
                }`}
              >
                STATISTICS
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            {message && (
              <div className={`mb-6 p-4 border-2 rounded text-sm ${
                messageType === 'success'
                  ? 'border-neonGreen text-neonGreen'
                  : 'border-red-500 text-red-500'
              }`}>
                {message}
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div>
                <h2 style={{ 
                  fontSize: 'clamp(11px, 2.3vw, 16px)',
                  textShadow: '0 0 10px #39FF14',
                  marginBottom: '1.5rem'
                }}>
                  USER MANAGEMENT ({users.length})
                </h2>

                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : users.length === 0 ? (
                  <div className="text-center text-gray-500">No users found</div>
                ) : (
                  <div className="overflow-x-auto border-2 border-neonGreen" style={{ boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)' }}>
                    <table className="w-full" style={{ fontSize: 'clamp(10px, 1.5vw, 13px)' }}>
                      <thead className="bg-neonGreen/10 border-b-2 border-neonGreen">
                        <tr>
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">AVATAR</th>
                          <th className="p-2 text-left">USERNAME</th>
                          <th className="p-2 text-left">EMAIL</th>
                          <th className="p-2 text-left">NAME</th>
                          <th className="p-2 text-center">ROLE</th>
                          <th className="p-2 text-center">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, idx) => (
                          <tr key={u.id} className={`border-b border-neonGreen/30 ${idx % 2 === 0 ? 'bg-black/50' : ''}`}>
                            {editingUser === u.id ? (
                              <>
                                <td className="p-2">{u.id}</td>
                                <td className="p-2">
                                  {u.avatar_url ? (
                                    <img src={u.avatar_url} alt="Avatar" className="w-8 h-8 rounded border border-neonGreen" />
                                  ) : (
                                    <div className="w-8 h-8 rounded border border-gray-600 flex items-center justify-center text-gray-600">-</div>
                                  )}
                                </td>
                                <td className="p-2">{u.username}</td>
                                <td className="p-2">
                                  <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="bg-black border-b border-neonGreen p-1 w-full outline-none text-neonGreen"
                                    style={{ fontSize: 'clamp(9px, 1.2vw, 12px)' }}
                                  />
                                </td>
                                <td className="p-2">
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      value={editForm.first_name}
                                      onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                                      placeholder="First"
                                      className="bg-black border-b border-neonGreen p-1 flex-1 outline-none text-neonGreen"
                                      style={{ fontSize: 'clamp(9px, 1.2vw, 12px)' }}
                                    />
                                    <input
                                      type="text"
                                      value={editForm.last_name}
                                      onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                                      placeholder="Last"
                                      className="bg-black border-b border-neonGreen p-1 flex-1 outline-none text-neonGreen"
                                      style={{ fontSize: 'clamp(9px, 1.2vw, 12px)' }}
                                    />
                                  </div>
                                </td>
                                <td className="p-2 text-center">
                                  <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                    className="bg-black border border-neonGreen p-1 outline-none text-neonGreen"
                                    style={{ fontSize: 'clamp(9px, 1.2vw, 12px)' }}
                                  >
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                  </select>
                                </td>
                                <td className="p-2 text-center">
                                  <button
                                    onClick={handleSaveUser}
                                    className="text-neonGreen hover:text-white border-b border-neonGreen hover:border-white mr-2"
                                    style={{ fontSize: 'clamp(9px, 1.2vw, 12px)' }}
                                  >
                                    SAVE
                                  </button>
                                  <button
                                    onClick={() => setEditingUser(null)}
                                    className="text-gray-500 hover:text-neonGreen border-b border-gray-500 hover:border-neonGreen"
                                    style={{ fontSize: 'clamp(9px, 1.2vw, 12px)' }}
                                  >
                                    CANCEL
                                  </button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="p-2">{u.id}</td>
                                <td className="p-2">
                                  {u.avatar_url ? (
                                    <img src={u.avatar_url} alt="Avatar" className="w-8 h-8 rounded border border-neonGreen object-cover" />
                                  ) : (
                                    <div className="w-8 h-8 rounded border border-gray-600 flex items-center justify-center text-gray-600">-</div>
                                  )}
                                </td>
                                <td className="p-2">{u.username}</td>
                                <td className="p-2">{u.email || '-'}</td>
                                <td className="p-2">{u.first_name || u.last_name ? `${u.first_name} ${u.last_name}` : '-'}</td>
                                <td className="p-2 text-center">
                                  <span className={`px-2 py-1 border ${u.role === 'admin' ? 'border-neonYellow text-neonYellow' : 'border-neonGreen text-neonGreen'}`}>
                                    {u.role.toUpperCase()}
                                  </span>
                                </td>
                                <td className="p-2 text-center">
                                  <button
                                    onClick={() => handleEditUser(u)}
                                    className="text-neonGreen hover:text-white border-b border-neonGreen hover:border-white mr-2"
                                    style={{ fontSize: 'clamp(9px, 1.2vw, 12px)' }}
                                  >
                                    EDIT
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="text-red-500 hover:text-red-400 border-b border-red-500 hover:border-red-400"
                                    style={{ fontSize: 'clamp(9px, 1.2vw, 12px)' }}
                                  >
                                    DELETE
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* LEADERBOARD TAB */}
            {activeTab === 'leaderboard' && (
              <div>
                <h2 style={{ 
                  fontSize: 'clamp(11px, 2.3vw, 16px)',
                  textShadow: '0 0 10px #39FF14',
                  marginBottom: '1.5rem'
                }}>
                  LEADERBOARD MANAGEMENT ({leaderboard.length})
                </h2>

                {/* Filters */}
                <div className="mb-6 p-4 border-2 border-neonGreen bg-neonGreen/5 space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">TIME PERIOD</label>
                      <select
                        value={leaderboardPeriod}
                        onChange={(e) => {
                          setLeaderboardPeriod(e.target.value);
                        }}
                        className="w-full bg-black border-2 border-neonGreen p-2 text-neonGreen text-xs outline-none"
                      >
                        <option value="all">All Time</option>
                        <option value="month">Last 30 Days</option>
                        <option value="week">Last 7 Days</option>
                        <option value="today">Today</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-2">DIFFICULTY</label>
                      <select
                        value={leaderboardDifficulty}
                        onChange={(e) => {
                          setLeaderboardDifficulty(e.target.value);
                        }}
                        className="w-full bg-black border-2 border-neonGreen p-2 text-neonGreen text-xs outline-none"
                      >
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                        <option value="insane">Insane</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">USERNAME</label>
                      <input
                        type="text"
                        value={leaderboardUsername}
                        onChange={(e) => {
                          setLeaderboardUsername(e.target.value);
                        }}
                        placeholder="Filter by username..."
                        className="w-full bg-black border-2 border-neonGreen p-2 text-neonGreen text-xs outline-none placeholder-gray-600"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={fetchLeaderboard}
                        className="w-full border-2 border-neonGreen bg-neonGreen/10 text-neonGreen p-2 hover:bg-neonGreen hover:text-black transition-all text-xs font-bold"
                        style={{ boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)' }}
                      >
                        APPLY FILTERS
                      </button>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center text-gray-500">No scores found</div>
                ) : (
                  <div className="overflow-x-auto border-2 border-neonGreen" style={{ boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)' }}>
                    <table className="w-full text-xs">
                      <thead className="bg-neonGreen/10 border-b-2 border-neonGreen">
                        <tr>
                          <th className="p-3 text-left">RANK</th>
                          <th className="p-3 text-left">AVATAR</th>
                          <th className="p-3 text-left">USERNAME</th>
                          <th className="p-3 text-center">SCORE</th>
                          <th className="p-3 text-center">WPM</th>
                          <th className="p-3 text-center">DIFFICULTY</th>
                          <th className="p-3 text-center">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((entry, idx) => (
                          <tr key={entry.id} className={`border-b border-neonGreen/30 ${idx % 2 === 0 ? 'bg-black/50' : ''}`}>
                            <td className="p-3 text-neonYellow font-bold">#{idx + 1}</td>
                            <td className="p-3">
                              {entry.avatar_url ? (
                                <img 
                                  src={entry.avatar_url} 
                                  alt={entry.username} 
                                  className="w-8 h-8 rounded-full border border-neonGreen"
                                  title={entry.username}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full border border-neonGreen bg-neonGreen/10 flex items-center justify-center text-xs font-bold">
                                  {entry.username.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </td>
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
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleDeleteScore(entry.id)}
                                className="text-red-500 hover:text-red-400 border-b border-red-500 hover:border-red-400 text-xs"
                              >
                                DELETE
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* STATS TAB */}
            {activeTab === 'stats' && (
              <div>
                <h2 style={{ 
                  fontSize: 'clamp(11px, 2.3vw, 16px)',
                  textShadow: '0 0 10px #39FF14',
                  marginBottom: '1.5rem'
                }}>
                  SYSTEM STATISTICS
                </h2>

                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : stats ? (
                  <div className="grid grid-cols-3 gap-6">
                    <div className="border-2 border-neonGreen p-6" style={{ boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)' }}>
                      <div className="text-gray-500 text-sm mb-2">TOTAL USERS</div>
                      <div className="text-5xl text-neonGreen font-bold">{stats.total_users}</div>
                    </div>

                    <div className="border-2 border-neonBlue p-6" style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)' }}>
                      <div className="text-gray-500 text-sm mb-2">TOTAL SCORES SUBMITTED</div>
                      <div className="text-5xl text-neonBlue font-bold">{stats.total_scores}</div>
                    </div>

                    <div className="border-2 border-neonYellow p-6" style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)' }}>
                      <div className="text-gray-500 text-sm mb-2">AVERAGE SCORE</div>
                      <div className="text-5xl text-neonYellow font-bold">{Math.round(stats.average_score)}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
