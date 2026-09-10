import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { INDIAN_STATES, SOCIAL_CATEGORIES, OCCUPATIONS } from '../utils/constants';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: 'Uttar Pradesh',
    occupation: 'Farmer',
    category: 'OBC',
    annualIncome: 180000,
    gender: 'Male',
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill all mandatory registration fields.', 'warning');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register(formData);
      showToast(`Registration successful! Welcome, ${newUser.name}.`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center justify-center space-x-2.5 mb-2">
          <span className="text-3xl">🇮🇳</span>
          <span className="text-2xl font-extrabold text-gov-navy tracking-tight">
            Yojana<span className="text-gov-saffron">Setu</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Citizen Portal Registration
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Create an account to access automatic eligibility scoring and application tracking.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rameshwar Patel"
                    className="w-full pl-9 pr-3 py-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="citizen@example.com"
                    className="w-full pl-9 pr-3 py-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  State of Residence
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Occupation
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {OCCUPATIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Social Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {SOCIAL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  placeholder="e.g. 180000"
                  className="w-full p-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gov-saffron hover:bg-orange-600 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Creating Citizen Profile...' : 'Complete Citizen Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-gov-sky hover:underline">
              Sign In to Your Account
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
