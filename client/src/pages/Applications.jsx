import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Calendar,
  Building2
} from 'lucide-react';
import { APPLICATION_STATUSES } from '../utils/constants';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function Applications() {
  const location = useLocation();
  const { showToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Form states
  const [newAppForm, setNewAppForm] = useState({
    schemeId: location.state?.schemeId || '',
    referenceNumber: '',
    status: 'Applied',
    notes: '',
  });

  const [editForm, setEditForm] = useState({
    status: 'Applied',
    referenceNumber: '',
    notes: '',
    comment: '',
  });

  useEffect(() => {
    fetchApplications();
    fetchSchemes();

    if (location.state?.schemeId) {
      setShowAddModal(true);
    }
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications');
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      showToast('Could not load tracked applications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await api.get('/schemes?limit=50');
      setSchemes(res.data.schemes || []);
    } catch (err) {
      console.error('Error loading schemes list:', err);
    }
  };

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    if (!newAppForm.schemeId) {
      showToast('Please select a scheme to track.', 'warning');
      return;
    }

    try {
      await api.post('/applications', newAppForm);
      showToast('Application tracking started successfully!', 'success');
      setShowAddModal(false);
      setNewAppForm({ schemeId: '', referenceNumber: '', status: 'Applied', notes: '' });
      fetchApplications();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to start tracking application', 'error');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/applications/${selectedApp._id}`, editForm);
      showToast('Application status updated!', 'success');
      setShowEditModal(false);
      fetchApplications();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update application', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to stop tracking this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      showToast('Application tracking removed.', 'info');
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      showToast('Failed to delete application record.', 'error');
    }
  };

  const openEditModal = (app) => {
    setSelectedApp(app);
    setEditForm({
      status: app.status,
      referenceNumber: app.referenceNumber || '',
      notes: app.notes || '',
      comment: '',
    });
    setShowEditModal(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy flex items-center gap-2.5">
              <FileText className="w-7 h-7 text-gov-sky" />
              Citizen Application Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track your acknowledgement numbers, verification stages, and disbursement updates in one place.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gov-saffron hover:bg-orange-600 text-white font-semibold text-xs rounded-xl transition shadow-sm inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Track New Application
          </button>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No applications tracked yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Once you submit an application on an official government portal, save its acknowledgement reference here to track its status.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-5 px-5 py-2.5 bg-gov-blue text-white text-xs font-semibold rounded-xl inline-block shadow-sm"
            >
              Add First Application
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
              if (app.status === 'Approved') badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              if (app.status === 'Rejected') badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
              if (app.status === 'Under Review') badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
              if (app.status === 'Completed') badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-card transition"
                >
                  {/* Top bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gov-lightBlue text-gov-blue">
                          {app.scheme?.category}
                        </span>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {app.scheme?.code}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900">
                        {app.scheme?.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeColor}`}>
                        {app.status}
                      </span>
                      <button
                        onClick={() => openEditModal(app)}
                        className="p-1.5 text-slate-400 hover:text-gov-blue hover:bg-slate-100 rounded-lg transition"
                        title="Update Status"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                        Reference / Ack No.
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {app.referenceNumber || 'Not Specified'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                        Submission Date
                      </span>
                      <span className="font-bold text-slate-800">
                        {new Date(app.applicationDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                        Official Portal
                      </span>
                      <a
                        href={app.scheme?.officialWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gov-sky hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        Open Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Citizen Notes if present */}
                  {app.notes && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4">
                      <strong>Notes:</strong> {app.notes}
                    </div>
                  )}

                  {/* Status Timeline Stepper */}
                  {app.timeline && app.timeline.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Activity Timeline
                      </p>
                      <div className="space-y-2">
                        {app.timeline.map((event, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs">
                            <div className="w-2 h-2 rounded-full bg-gov-sky mt-1.5 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="font-semibold text-slate-800 mr-2">
                                {event.status}
                              </span>
                              <span className="text-slate-500 text-[11px]">
                                {event.comment || 'Status recorded'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(event.date).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Track New Application */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Track Scheme Application
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Record your application acknowledgement ID to track approval status.
              </p>

              <form onSubmit={handleCreateApplication} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Select Scheme *
                  </label>
                  <select
                    required
                    value={newAppForm.schemeId}
                    onChange={(e) => setNewAppForm({ ...newAppForm, schemeId: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  >
                    <option value="">-- Choose Government Scheme --</option>
                    {schemes.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Acknowledgement / Reference Number
                  </label>
                  <input
                    type="text"
                    value={newAppForm.referenceNumber}
                    onChange={(e) => setNewAppForm({ ...newAppForm, referenceNumber: e.target.value })}
                    placeholder="e.g. ACK-2026-908123"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Current Status
                  </label>
                  <select
                    value={newAppForm.status}
                    onChange={(e) => setNewAppForm({ ...newAppForm, status: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  >
                    {APPLICATION_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Personal Notes (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={newAppForm.notes}
                    onChange={(e) => setNewAppForm({ ...newAppForm, notes: e.target.value })}
                    placeholder="e.g. Submitted biometrics at CSC centre; verification pending by Tehsildar."
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-xl font-bold transition shadow-sm"
                  >
                    Start Tracking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Update Status */}
        {showEditModal && selectedApp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Update Status
              </h3>
              <p className="text-xs text-slate-500 mb-4 truncate">
                {selectedApp.scheme?.name}
              </p>

              <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none font-semibold"
                  >
                    {APPLICATION_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={editForm.referenceNumber}
                    onChange={(e) => setEditForm({ ...editForm, referenceNumber: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Timeline Update Comment
                  </label>
                  <input
                    type="text"
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                    placeholder="e.g. Document verified; pending approval."
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-xl font-bold transition shadow-sm"
                  >
                    Save Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
