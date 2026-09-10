import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Bookmark,
  IndianRupee,
  Calendar,
  ExternalLink,
  Phone,
  FileCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  ArrowLeft,
  Share2,
  Bot,
  FileText,
  AlertTriangle
} from 'lucide-react';
import EligibilityBadge from '../components/EligibilityBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { INDIAN_STATES, OCCUPATIONS } from '../utils/constants';
import api from '../services/api';

export default function SchemeDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Custom simulator form state for guest or testing
  const [simForm, setSimForm] = useState({
    age: '',
    gender: 'Male',
    state: 'All India',
    occupation: 'Farmer',
    annualIncome: '',
    category: 'General',
  });
  const [showSimulator, setShowSimulator] = useState(false);

  useEffect(() => {
    fetchSchemeDetails();
  }, [id]);

  useEffect(() => {
    if (scheme && (isAuthenticated || searchParams.get('check') === '1')) {
      checkEligibility();
    }
  }, [scheme, isAuthenticated]);

  const fetchSchemeDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/schemes/${id}`);
      setScheme(res.data.scheme);

      if (user?.savedSchemes?.some((s) => (s._id || s) === res.data.scheme._id)) {
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error fetching scheme details:', err);
      showToast('Government scheme could not be loaded.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (customData = null) => {
    setEvaluating(true);
    try {
      const payload = customData || (user ? {} : simForm);
      const res = await api.post(`/eligibility/check/${id}`, payload);
      setEvaluation(res.data.data);
    } catch (err) {
      console.error('Eligibility check error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSimulate = (e) => {
    e.preventDefault();
    checkEligibility(simForm);
  };

  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to save schemes to your citizen portal.', 'warning');
      return;
    }

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
    } catch (err) {
      showToast('Failed to update bookmark.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-navy"></div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Scheme not found</h2>
        <Link to="/schemes" className="text-gov-sky hover:underline mt-2 inline-block">
          ← Return to Schemes Catalog
        </Link>
      </div>
    );
  }

  const crit = scheme.eligibilityCriteria || {};

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Back link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/schemes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-navy transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Schemes Catalog
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Scheme link copied to clipboard!', 'success');
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition inline-flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button
              onClick={toggleBookmark}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-amber-600' : ''}`} />
              {isSaved ? 'Saved to Portal' : 'Save Scheme'}
            </button>
          </div>
        </div>

        {/* Scheme Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-gov-lightBlue text-gov-blue">
              {scheme.category}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              {scheme.level} Scheme
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              State: {scheme.state}
            </span>
            {scheme.code && (
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-orange-50 text-gov-saffron border border-orange-200">
                {scheme.code}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gov-navy leading-tight">
            {scheme.name}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-700">{scheme.ministry}</span>
            {scheme.department && <span>• {scheme.department}</span>}
          </div>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Financial / In-Kind Benefit</p>
              <p className="text-base font-extrabold text-emerald-950 mt-1">{scheme.benefitAmount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Application Mode</p>
              <p className="text-base font-extrabold text-blue-950 mt-1">{scheme.applicationProcess?.mode || 'Online'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Citizen Helpline</p>
              <p className="text-sm font-extrabold text-amber-950 mt-1 font-mono">{scheme.helpline}</p>
            </div>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Description & Benefits */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Scheme Overview</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {scheme.description}
              </p>

              <h3 className="text-sm font-bold text-slate-900 mt-6 mb-3">Key Benefits & Entitlements</h3>
              <div className="space-y-2.5">
                {scheme.benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-normal font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Structured Eligibility Criteria */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Official Eligibility Criteria</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500 block">Eligible Age Group</span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block">
                    {crit.minAge || 0} to {crit.maxAge || 120} Years
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500 block">Target Gender</span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block">
                    {crit.gender || 'All'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500 block">Annual Income Ceiling</span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block">
                    {crit.maxAnnualIncome ? `Up to ₹${crit.maxAnnualIncome.toLocaleString('en-IN')} / year` : 'No Income Ceiling'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500 block">Eligible Occupations</span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block">
                    {crit.allowedOccupations?.join(', ') || 'All Occupations'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500 block">Social Categories</span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block">
                    {crit.allowedCategories?.join(', ') || 'All'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500 block">State Jurisdiction</span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block">
                    {crit.allowedStates?.join(', ') || 'All India'}
                  </span>
                </div>
              </div>

              {crit.customRules && crit.customRules.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-bold text-amber-900 mb-2">Special Terms & Exclusions:</p>
                  <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                    {crit.customRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 3. Mandatory Documents Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-gov-sky" />
                Required Documents Checklist
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Please prepare the following documents before visiting the portal or nearest Kendra.
              </p>

              <div className="space-y-3">
                {scheme.documentsRequired?.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          doc.mandatory ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {doc.mandatory ? 'Mandatory' : 'Optional'}
                        </span>
                      </div>
                      {doc.description && (
                        <p className="text-[11px] text-slate-500 mt-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Step-by-Step Application Guide */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">How to Apply Step-by-Step</h2>
              
              <div className="space-y-4">
                {scheme.applicationProcess?.steps?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-gov-blue text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              {/* External Apply Button */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-800">Official Government Portal:</p>
                  <p className="text-[11px] text-slate-500 truncate max-w-sm">{scheme.officialWebsite}</p>
                </div>
                <a
                  href={scheme.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-gov-saffron hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition shadow-md inline-flex items-center justify-center gap-2"
                >
                  Apply on Official Portal <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Sidebar Column: Live Eligibility Report & Actions (Right 1 col) */}
          <div className="space-y-6">
            
            {/* Live Eligibility Engine Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gov-sky" />
                  Your Eligibility Report
                </h3>
                {evaluation && (
                  <EligibilityBadge status={evaluation.status} score={evaluation.matchScore} size="sm" />
                )}
              </div>

              {evaluating ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-navy mx-auto mb-2"></div>
                  <p className="text-xs text-slate-500">Evaluating against scheme criteria...</p>
                </div>
              ) : evaluation ? (
                <div className="space-y-4">
                  
                  {/* Positive reasons */}
                  {evaluation.positiveReasons?.length > 0 && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-[11px] font-bold text-emerald-900 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Why you are eligible:
                      </p>
                      <ul className="space-y-1 text-[11px] text-emerald-800">
                        {evaluation.positiveReasons.map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Negative reasons */}
                  {evaluation.negativeReasons?.length > 0 && (
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                      <p className="text-[11px] font-bold text-rose-900 mb-1.5 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Criteria not matched:
                      </p>
                      <ul className="space-y-1 text-[11px] text-rose-800">
                        {evaluation.negativeReasons.map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing fields or warnings */}
                  {evaluation.missingProfileFields?.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-[11px] font-bold text-amber-900 mb-1">Missing Profile Information:</p>
                      <p className="text-[11px] text-amber-800">
                        Provide {evaluation.missingProfileFields.join(', ')} in your profile to verify remaining criteria.
                      </p>
                      {isAuthenticated && (
                        <Link to="/profile" className="text-[11px] font-bold text-gov-sky hover:underline mt-1 inline-block">
                          Update Profile →
                        </Link>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setShowSimulator(!showSimulator)}
                    className="w-full text-center text-xs text-gov-sky hover:underline font-semibold pt-1"
                  >
                    {showSimulator ? 'Hide Simulator' : 'Test With Different Values'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-500 mb-3">
                    Check whether your profile qualifies for this government initiative.
                  </p>
                  <button
                    onClick={() => checkEligibility()}
                    className="w-full py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-xl transition shadow-sm"
                  >
                    Run Automated Match
                  </button>
                </div>
              )}

              {/* Simulator Panel (accordion) */}
              {showSimulator && (
                <form onSubmit={handleSimulate} className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-700">Eligibility Simulator</p>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500">Age</label>
                    <input
                      type="number"
                      value={simForm.age}
                      onChange={(e) => setSimForm({ ...simForm, age: e.target.value })}
                      placeholder="e.g. 28"
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500">Annual Income (₹)</label>
                    <input
                      type="number"
                      value={simForm.annualIncome}
                      onChange={(e) => setSimForm({ ...simForm, annualIncome: e.target.value })}
                      placeholder="e.g. 180000"
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500">Occupation</label>
                    <select
                      value={simForm.occupation}
                      onChange={(e) => setSimForm({ ...simForm, occupation: e.target.value })}
                      className="w-full p-2 border rounded-lg text-xs bg-white"
                    >
                      {OCCUPATIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500">State</label>
                    <select
                      value={simForm.state}
                      onChange={(e) => setSimForm({ ...simForm, state: e.target.value })}
                      className="w-full p-2 border rounded-lg text-xs bg-white"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gov-saffron hover:bg-orange-600 text-white font-semibold text-xs rounded-lg transition"
                  >
                    Simulate Eligibility
                  </button>
                </form>
              )}

              {/* Quick Action links */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                {isAuthenticated && (
                  <button
                    onClick={() => navigate('/applications', { state: { schemeId: scheme._id, schemeName: scheme.name } })}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    Track My Application
                  </button>
                )}
                <Link
                  to={`/ai-assistant?schemeId=${scheme._id}`}
                  className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-gov-saffron text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 border border-orange-200"
                >
                  <Bot className="w-4 h-4" />
                  Ask AI About This Scheme
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
