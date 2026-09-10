import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  ArrowLeft,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function AdminSchemes() {
  const { showToast } = useToast();
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/schemes?limit=100&active=all');
      setSchemes(res.data.schemes || []);
    } catch (err) {
      console.error('Error fetching admin schemes:', err);
      showToast('Could not load schemes list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await api.patch(`/admin/schemes/${id}/toggle-status`);
      showToast(res.data.message || 'Scheme status updated', 'success');
      setSchemes((prev) =>
        prev.map((s) => (s._id === id ? { ...s, active: res.data.scheme.active } : s))
      );
    } catch (err) {
      showToast('Failed to toggle scheme status.', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      await api.delete(`/schemes/${id}`);
      showToast('Scheme deleted successfully.', 'info');
      setSchemes((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      showToast('Failed to delete scheme.', 'error');
    }
  };

  const filtered = schemes.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.ministry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Title */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin"
            className="text-xs font-semibold text-slate-500 hover:text-gov-navy flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin Console
          </Link>
          <Link
            to="/admin/schemes/new"
            className="px-4 py-2 bg-gov-saffron hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create New Scheme
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Manage Government Schemes ({filtered.length})
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit scheme parameters, eligibility limits, or toggle public availability.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scheme name or code..."
                className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-navy mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading catalog...</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">No schemes found matching search.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 px-3">Code</th>
                    <th className="pb-3 px-3">Scheme Name</th>
                    <th className="pb-3 px-3">Ministry</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-gov-saffron">
                        {s.code}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800 max-w-xs truncate">
                        <Link to={`/schemes/${s._id}`} className="hover:text-gov-sky">
                          {s.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 max-w-[200px] truncate">
                        {s.ministry}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleToggleActive(s._id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            s.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {s.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-2">
                        <Link
                          to={`/admin/schemes/edit/${s._id}`}
                          className="p-1.5 text-slate-600 hover:text-gov-blue hover:bg-slate-100 rounded-lg inline-block"
                          title="Edit Scheme"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(s._id, s.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg inline-block"
                          title="Delete Scheme"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
