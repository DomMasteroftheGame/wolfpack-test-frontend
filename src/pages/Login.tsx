import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Invalid credentials. Access denied.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B0F19] font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/5 via-[#0B0F19] to-[#0B0F19]" />

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[#FBBF24] font-bold text-sm tracking-wide hover:text-yellow-400 transition-colors"
      >
        ← BACK TO COMMAND CENTER
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <span className="font-black italic text-black text-2xl">WP</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] p-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">WELCOME BACK</h1>
            <h2 className="text-[#9CA3AF] text-sm font-bold uppercase tracking-widest">Access Terminal</h2>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded bg-[#7F1D1D]/20 border border-[#B91C1C] flex items-start gap-3">
              <span className="text-[#FCA5A5]">⚠️</span>
              <p className="text-[#FCA5A5] text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                COMM LINK (EMAIL)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-[#1F2937] border border-[#374151] rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition-all"
                placeholder="EMAIL@DOMAIN.COM"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                ACCESS KEY (PASSWORD)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-[#1F2937] border border-[#374151] rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded bg-gradient-to-r from-[#D97706] to-[#B45309] text-black font-extrabold uppercase tracking-widest hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D97706] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('This will purge all local credentials. Continue?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full text-[10px] text-[#4B5563] hover:text-[#9CA3AF] uppercase tracking-widest transition-colors mt-4"
            >
              // DEBUG: PURGE LOCAL CREDENTIALS
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#9CA3AF]">
              Need credentials?{' '}
              <Link to="/register" className="font-bold text-[#D97706] hover:text-[#FBBF24] transition-colors">
                JOIN THE PACK
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center font-mono text-[10px] text-[#4B5563] tracking-widest">
          PROJECT ANTIGRAVITY // SECTOR 7 // HQ: HTTPS://BUILDYOURWOLFPACK.ONRENDER.COM
        </div>
      </div>
    </div>
  );
};

export default Login;
