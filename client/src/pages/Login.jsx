import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, ShieldCheck, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setEmail('admin@govscheme.nic.in');
      setPassword('Admin@12345');
    } else {
      setEmail('citizen@example.com');
      setPassword('Citizen@12345');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center justify-center space-x-2.5 mb-2">
          <span className="text-3xl">🇮🇳</span>
          <span className="text-2xl font-extrabold text-gov-navy tracking-tight">
            Yojana<span className="text-gov-saffron">Setu</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Citizen & Officer Portal Login
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your eligibility records, personalized recommendations, and application status.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. citizen@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gov-blue hover:bg-gov-navy text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Quick Demo Login:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('citizen')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <p className="text-[11px] font-bold text-slate-800">Demo Citizen</p>
                <p className="text-[10px] text-slate-500 font-mono">citizen@example.com</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-left transition"
              >
                <p className="text-[11px] font-bold text-red-800">Admin Officer</p>
                <p className="text-[10px] text-red-600 font-mono">admin@govscheme.nic.in</p>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-gov-sky hover:underline">
              Register as New Citizen
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">
            ← Back to National Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
