import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, Trash2, ExternalLink, ShieldCheck, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function SavedSchemes() {
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookmarks');
      setSavedSchemes(res.data.savedSchemes || []);
    } catch (err) {
      console.error('Error fetching saved schemes:', err);
      showToast('Could not load saved schemes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (schemeId) => {
    try {
      await api.delete(`/bookmarks/${schemeId}`);
      setSavedSchemes((prev) => prev.filter((s) => s._id !== schemeId));
      showToast('Scheme removed from saved list.', 'info');
      refreshUser();
    } catch (err) {
      showToast('Failed to remove scheme.', 'error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy flex items-center gap-2.5">
              <Bookmark className="w-7 h-7 text-amber-500 fill-current" />
              Saved Government Schemes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your bookmarked welfare programs for quick access, eligibility checks, and application filing.
            </p>
          </div>
          <Link
            to="/schemes"
            className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-xl transition shadow-sm inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            Explore More Schemes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : savedSchemes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No saved schemes yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              When you browse schemes or check your personalized recommendations, click the bookmark icon to save them here.
            </p>
            <Link
              to="/schemes"
              className="mt-5 px-5 py-2.5 bg-gov-blue text-white text-xs font-semibold rounded-xl inline-block shadow-sm"
            >
              Browse Schemes Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSchemes.map((scheme) => (
              <div
                key={scheme._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-card transition flex flex-col md:flex-row items-start justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gov-lightBlue text-gov-blue">
                      {scheme.category}
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {scheme.code}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Level: {scheme.level}
                    </span>
                  </div>

                  <Link to={`/schemes/${scheme._id}`} className="hover:text-gov-sky transition">
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {scheme.name}
                    </h2>
                  </Link>

                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {scheme.ministry}
                  </p>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {scheme.description}
                  </p>

                  <div className="mt-3 inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    💰 Benefit: {scheme.benefitAmount}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-48 flex-shrink-0">
                  <Link
                    to={`/schemes/${scheme._id}`}
                    className="w-full py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-xl transition text-center shadow-sm"
                  >
                    View Details & Apply
                  </Link>
                  <a
                    href={scheme.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition text-center inline-flex items-center justify-center gap-1"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => handleRemove(scheme._id)}
                    className="w-full py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove from Saved
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
