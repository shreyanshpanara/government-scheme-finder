import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckCircle2,
  Bookmark,
  FileText,
  User,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Bot
} from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [recsRes, appsRes, bkmkRes] = await Promise.allSettled([
        api.get('/recommendations'),
        api.get('/applications'),
        api.get('/bookmarks')
      ]);

      if (recsRes.status === 'fulfilled') {
        setRecommendations(recsRes.value.data.recommendations || []);
      }
      if (appsRes.status === 'fulfilled') {
        setApplications(appsRes.value.data.applications || []);
      }
      if (bkmkRes.status === 'fulfilled') {
        setSavedCount(bkmkRes.value.data.count || 0);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const profilePct = user?.profileCompletion !== undefined ? user.profileCompletion : 60;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-orange-200 border border-white/20">
              National Citizen Welfare Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
              Track your welfare eligibility, saved schemes, and application progress across Central & State government programs.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/eligibility"
              className="px-5 py-2.5 bg-gov-saffron hover:bg-orange-600 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Check All Eligibility
            </Link>
            <Link
              to="/ai-assistant"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition border border-white/20 flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-amber-300" /> Ask AI
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. Recommended / Eligible */}
          <Link
            to="/recommendations"
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-cardHover transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recommended For You
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-slate-900">
                {recommendations.length}
              </p>
              <p className="text-xs text-gov-sky font-semibold mt-1 flex items-center gap-1">
                View matched schemes <ArrowRight className="w-3 h-3" />
              </p>
            </div>
          </Link>

          {/* 2. Saved Schemes */}
          <Link
            to="/saved-schemes"
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-cardHover transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Saved Schemes
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-slate-900">{savedCount}</p>
              <p className="text-xs text-gov-sky font-semibold mt-1 flex items-center gap-1">
                Manage saved list <ArrowRight className="w-3 h-3" />
              </p>
            </div>
          </Link>

          {/* 3. Tracked Applications */}
          <Link
            to="/applications"
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-cardHover transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tracked Applications
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-slate-900">
                {applications.length}
              </p>
              <p className="text-xs text-gov-sky font-semibold mt-1 flex items-center gap-1">
                Check status timeline <ArrowRight className="w-3 h-3" />
              </p>
            </div>
          </Link>

          {/* 4. Profile Completion */}
          <Link
            to="/profile"
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-cardHover transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Profile Health
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-slate-900">{profilePct}%</p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profilePct}%` }}
                />
              </div>
            </div>
          </Link>

        </div>

        {/* Active Applications Quick Pipeline */}
        {applications.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Clock className="w-4 h-4 text-gov-sky" />
                Recent Application Tracking
              </div>
              <Link to="/applications" className="text-xs font-semibold text-gov-sky hover:underline">
                View All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {applications.slice(0, 3).map((app) => (
                <div key={app._id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{app.scheme?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Ack Ref: <span className="font-mono font-semibold">{app.referenceNumber || 'Pending'}</span> •{' '}
                      {new Date(app.applicationDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                    app.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Recommended Schemes Carousel / Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recommended Schemes For Your Profile</h2>
              <p className="text-xs text-slate-500">Based on your occupation as {user?.occupation || 'Citizen'}</p>
            </div>
            <Link to="/recommendations" className="text-xs font-bold text-gov-sky hover:underline">
              Explore All Recommendations →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((item) => (
              <SchemeCard
                key={item.scheme._id}
                scheme={item.scheme}
                evaluation={item.evaluation}
                isSavedInitial={item.isSaved}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
