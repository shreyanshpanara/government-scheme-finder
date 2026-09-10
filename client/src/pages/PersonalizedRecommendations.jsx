import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Building2,
  IndianRupee,
  AlertCircle
} from 'lucide-react';
import EligibilityBadge from '../components/EligibilityBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function PersonalizedRecommendations() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [recommendations, setRecommendations] = useState([]);
  const [exploreOthers, setExploreOthers] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recommendations');
      setRecommendations(res.data.recommendations || []);
      setExploreOthers(res.data.exploreOthers || []);
      setProfileCompletion(res.data.profileCompletion || 100);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      showToast('Could not load personalized recommendations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (schemeId, currentlySaved) => {
    try {
      if (currentlySaved) {
        await api.delete(`/bookmarks/${schemeId}`);
        showToast('Scheme removed from saved list.', 'info');
      } else {
        await api.post(`/bookmarks/${schemeId}`);
        showToast('Scheme saved to your citizen portal!', 'success');
      }
      refreshUser();
      fetchRecommendations();
    } catch (err) {
      showToast('Failed to update saved scheme.', 'error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3 border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Personalized Welfare Matching
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy">
            Recommended Schemes For {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ranked by automated rule matching against your occupation ({user?.occupation}), category ({user?.category}), and state ({user?.state}).
          </p>
        </div>

        {/* Profile Completion Alert if < 90% */}
        {profileCompletion < 90 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">
                  Your citizen profile is {profileCompletion}% complete
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Complete demographic details like annual income and education to unlock higher accuracy matches.
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition flex-shrink-0"
            >
              Complete Profile
            </Link>
          </div>
        )}

        {/* Recommendations List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No high-confidence matches found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try updating your profile with your annual income or exploring the full schemes catalog.
            </p>
            <Link
              to="/schemes"
              className="mt-4 px-4 py-2 bg-gov-blue text-white text-xs font-semibold rounded-lg inline-block"
            >
              Browse All Schemes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map(({ scheme, evaluation, relevanceScore, isSaved }) => (
              <div
                key={scheme._id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-card hover:shadow-cardHover transition duration-300 flex flex-col lg:flex-row items-start justify-between gap-6"
              >
                <div className="flex-1">
                  
                  {/* Category & Badge */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gov-lightBlue text-gov-blue">
                      {scheme.category}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {scheme.code}
                    </span>
                    <EligibilityBadge
                      status={evaluation.status}
                      score={relevanceScore}
                      size="sm"
                    />
                  </div>

                  <Link to={`/schemes/${scheme._id}`} className="hover:text-gov-sky transition">
                    <h2 className="text-lg font-bold text-slate-900 leading-snug">
                      {scheme.name}
                    </h2>
                  </Link>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {scheme.ministry}
                  </p>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {scheme.description}
                  </p>

                  {/* Benefit amount callout */}
                  <div className="mt-3 inline-flex items-center gap-2 p-2 px-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-950">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span>Benefit: {scheme.benefitAmount}</span>
                  </div>

                  {/* Why recommended explanation box */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Why recommended for you:
                    </p>
                    <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                      {evaluation.positiveReasons.slice(0, 3).map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Right action column */}
                <div className="flex flex-col gap-2.5 w-full lg:w-48 flex-shrink-0 pt-2">
                  <Link
                    to={`/schemes/${scheme._id}`}
                    className="w-full py-2.5 bg-gov-blue hover:bg-gov-navy text-white font-semibold text-xs rounded-xl transition text-center shadow-sm"
                  >
                    View Details & Apply
                  </Link>
                  <button
                    onClick={() => handleToggleBookmark(scheme._id, isSaved)}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-center gap-1.5 ${
                      isSaved
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-amber-600' : ''}`} />
                    {isSaved ? 'Saved to Portal' : 'Save Scheme'}
                  </button>
                  <a
                    href={scheme.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition text-center inline-flex items-center justify-center gap-1"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
