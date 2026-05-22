import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      if (response && response.token) {
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_username', response.username || 'admin');
        navigate('/admin');
      } else {
        setError('Resposta inválida do servidor.');
      }
    } catch (err) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060408] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Neon Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF2E8B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-widest text-white uppercase">
            MARIA PITA
          </h2>
          <p className="text-[#FF2E8B] text-xs uppercase tracking-widest font-semibold mt-1">
            Painel Administrativo
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#0E0B12]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(255,46,139,0.05)]">
          <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-6">
            Acesso Restrito
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors font-medium"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] transition-colors font-medium"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black hover:bg-[#FF2E8B] hover:text-white rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <span>Acessando...</span>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-white/40 hover:text-[#FF2E8B] uppercase tracking-widest font-semibold transition-colors"
          >
            Voltar para o site oficial
          </a>
        </div>

      </div>
    </div>
  );
}
