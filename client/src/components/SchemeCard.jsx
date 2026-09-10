import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Building2, IndianRupee, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import EligibilityBadge from './EligibilityBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function SchemeCard({ scheme, evaluation, isSavedInitial = false, onBookmarkChange }) {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const { showToast } = useToast();
  
  // Check if scheme is in user's saved list
  const userSaved = user?.savedSchemes?.some(
    (s) => (s._id || s) === scheme._id
  );
  const [isSaved, setIsSaved] = useState(isSavedInitial || userSaved);
  const [saving, setSaving] = useState(false);

  const toggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please sign in to save schemes to your citizen portal.', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/bookmarks/${scheme._id}`);
        setIsSaved(false);
        showToast('Scheme removed from your saved list.', 'info');
      } else {
        await api.post(`/bookmarks/${scheme._id}`);
        setIsSaved(true);
        showToast('Scheme saved to your citizen portal!', 'success');
      }
      if (refreshUser) refreshUser();
      if (onBookmarkChange) onBookmarkChange(scheme._id, !isSaved);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update saved scheme', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Card Header: Category & Bookmark button */}
      <div className="p-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gov-lightBlue text-gov-blue">
              {scheme.category}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {scheme.level || 'Central'} Scheme
            </span>
            {scheme.featured && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wide">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span className="truncate max-w-[240px]" title={scheme.ministry}>
              {scheme.ministry}
            </span>
          </div>
        </div>

        <button
          onClick={toggleBookmark}
          disabled={saving}
          title={isSaved ? 'Remove from Saved' : 'Save Scheme'}
          className={`p-2 rounded-xl transition-all ${
            isSaved
              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <Link to={`/schemes/${scheme._id}`} className="group-hover:text-gov-sky transition">
            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
              {scheme.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {scheme.description}
          </p>
        </div>

        {/* Benefit Amount Callout */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-semibold text-slate-600 tracking-wider">Benefit Support</p>
            <p className="text-xs font-bold text-slate-800 truncate">{scheme.benefitAmount}</p>
          </div>
        </div>

        {/* Eligibility Status Evaluation if provided */}
        {evaluation && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Your Eligibility:</span>
            <EligibilityBadge status={evaluation.status} score={evaluation.matchScore} size="sm" />
          </div>
        )}
      </div>

      {/* Card Footer: Action Links */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/schemes/${scheme._id}`}
          className="text-xs font-semibold text-gov-sky hover:text-gov-navy transition inline-flex items-center gap-1"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={`/schemes/${scheme._id}?check=1`}
          className="px-3 py-1.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-medium rounded-lg transition shadow-sm inline-flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Check Eligibility
        </Link>
      </div>
    </div>
  );
}
