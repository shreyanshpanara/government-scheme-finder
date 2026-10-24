
import React, { useState, useEffect } from 'react';
import SchemeStatsDashboard from '../components/SchemeStatsDashboard';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Building2,
  FileText,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);

    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
      showToast('Could not load admin portal metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const summary = analytics?.summary || {};

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Admin Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-gov-saffron">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-red-500" />

              <span className="text-xs font-bold uppercase tracking-wider bg-red-900/50 text-red-300 px-2.5 py-0.5 rounded border border-red-800">
                National Administration Console
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Officer Portal — {user?.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Manage national welfare schemes, monitor citizen application flow, and governance analytics.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/admin/schemes"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition border border-white/20"
            >
              Manage Schemes
            </Link>

            <Link
              to="/admin/schemes/new"
              className="px-4 py-2.5 bg-gov-saffron hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add New Scheme
            </Link>
          </div>
        </div>

        {/* NEW: Scheme Statistics Dashboard */}
        <SchemeStatsDashboard />

        {/* Existing 4 Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Registered Citizens */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
                <span>Registered Citizens</span>
                <Users className="w-5 h-5 text-gov-sky" />
              </div>

              <p className="text-3xl font-extrabold text-slate-900 mt-3">
                {summary.totalUsers || 0}
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                Beneficiary profiles in database
              </p>
            </div>

            {/* Active Schemes */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
                <span>Active Schemes</span>
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>

              <p className="text-3xl font-extrabold text-slate-900 mt-3">
                {summary.activeSchemes || 0}
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                Out of {summary.totalSchemes || 0} total schemes
              </p>
            </div>

            {/* Tracked Applications */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
                <span>Tracked Applications</span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>

              <p className="text-3xl font-extrabold text-slate-900 mt-3">
                {summary.totalApplications || 0}
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                Citizen submissions logged
              </p>
            </div>

            {/* Database Engine */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase">
                <span>Database Engine</span>
                <Activity className="w-5 h-5 text-amber-600" />
              </div>

              <p className="text-lg font-extrabold text-slate-900 mt-4">
                MongoDB Active
              </p>

              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                ● Operational 100%
              </p>
            </div>

          </div>
        )}

        {/* Breakdown Sections */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Applications Status Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gov-sky" />
                Applications Status Breakdown
              </h2>

              <div className="space-y-3">
                {analytics.applicationStats?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No applications recorded yet.
                  </p>
                ) : (
                  analytics.applicationStats?.map((st) => (
                    <div
                      key={st.status}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="text-xs font-semibold text-slate-800">
                        {st.status}
                      </span>

                      <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-lg border border-slate-200 text-slate-900">
                        {st.count}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Scheme Category Distribution */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Scheme Categories Distribution
              </h2>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {analytics.categoryStats?.map((c) => (
                  <div
                    key={c.category}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs"
                  >
                    <span className="font-medium text-slate-700">
                      {c.category}
                    </span>

                    <span className="font-bold text-gov-blue">
                      {c.count} schemes
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
