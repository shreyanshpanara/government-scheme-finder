import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  RotateCcw,
  Sparkles,
  Bookmark,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import EligibilityBadge from '../components/EligibilityBadge';
import { INDIAN_STATES, SOCIAL_CATEGORIES, OCCUPATIONS, EDUCATION_LEVELS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function EligibilityChecker() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    state: 'All India',
    district: '',
    category: 'General',
    occupation: 'Farmer',
    annualIncome: '',
    education: '10th Pass',
    disabilityStatus: false,
    disabilityPercentage: 0,
  });

  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ELIGIBLE' | 'LIKELY_ELIGIBLE' | 'INELIGIBLE'

  // Pre-fill with user profile if logged in
  useEffect(() => {
    if (user) {
      // calculate age from date of birth
      let calculatedAge = '';
      if (user.dateOfBirth) {
        const dob = new Date(user.dateOfBirth);
        calculatedAge = Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970);
      }

      setFormData({
        age: calculatedAge || '',
        gender: user.gender !== 'Prefer not to say' ? user.gender : 'Male',
        state: user.state || 'All India',
        district: user.district || '',
        category: user.category || 'General',
        occupation: user.occupation || 'Farmer',
        annualIncome: user.annualIncome || '',
        education: user.education !== 'Not Specified' ? user.education : '10th Pass',
        disabilityStatus: user.disabilityStatus || false,
        disabilityPercentage: user.disabilityPercentage || 0,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/eligibility/check-all', formData);
      setResults(res.data.results || []);
      setSummary(res.data.summary || {});
      setActiveTab('ELIGIBLE'); // Default focus on schemes they qualify for!
    } catch (err) {
      console.error('Eligibility check error:', err);
      showToast('Could not evaluate eligibility. Please check your inputs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setSummary(null);
    setActiveTab('ALL');
  };

  const filteredResults = results
    ? activeTab === 'ALL'
      ? results
      : results.filter((r) => r.status === activeTab)
    : [];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-3 border border-orange-200">
            <ShieldCheck className="w-4 h-4 text-gov-saffron" />
            Transparent Rule-Based Eligibility Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy tracking-tight">
            Indian Citizen Scheme Eligibility Checker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Provide your basic profile parameters to instantly calculate which Central and State government welfare initiatives you and your family qualify for.
          </p>
        </div>

        {/* Input Questionnaire Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card mb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">
                1. Citizen Profile Parameters
              </h2>
              {isAuthenticated && (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                  ✓ Profile Loaded From Account
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 32"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  State of Residence *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Occupation *
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {OCCUPATIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Annual Family Income (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  placeholder="e.g. 180000"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>

              {/* Social Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Social Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {SOCIAL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Education Level
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {EDUCATION_LEVELS.map((ed) => (
                    <option key={ed} value={ed}>{ed}</option>
                  ))}
                </select>
              </div>

              {/* Disability Status */}
              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="disabilityCheck"
                  checked={formData.disabilityStatus}
                  onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.checked })}
                  className="w-4 h-4 text-gov-sky rounded border-slate-300 focus:ring-gov-sky"
                />
                <label htmlFor="disabilityCheck" className="text-xs font-semibold text-slate-700">
                  Person with Benchmark Disability (Divyangjan)
                </label>
              </div>

            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                🔒 Your personal data is evaluated locally in memory and never shared with commercial third parties.
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {results && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Evaluating 12+ Schemes...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Evaluate My Eligibility</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Evaluation Results Section */}
        {results && (
          <div className="space-y-6">
            
            {/* Summary Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setActiveTab('ELIGIBLE')}
                className={`p-5 rounded-2xl border cursor-pointer transition shadow-sm ${
                  activeTab === 'ELIGIBLE'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500'
                    : 'bg-white border-slate-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Fully Eligible
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-950 mt-2">
                  {summary?.eligibleCount || 0}
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">Schemes with 100% matched criteria</p>
              </div>

              <div
                onClick={() => setActiveTab('LIKELY_ELIGIBLE')}
                className={`p-5 rounded-2xl border cursor-pointer transition shadow-sm ${
                  activeTab === 'LIKELY_ELIGIBLE'
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500'
                    : 'bg-white border-slate-200 hover:border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Likely Eligible
                  </span>
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-3xl font-extrabold text-amber-950 mt-2">
                  {summary?.likelyEligibleCount || 0}
                </p>
                <p className="text-[11px] text-amber-700 mt-1">Minor documentation or verification needed</p>
              </div>

              <div
                onClick={() => setActiveTab('INELIGIBLE')}
                className={`p-5 rounded-2xl border cursor-pointer transition shadow-sm ${
                  activeTab === 'INELIGIBLE'
                    ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500'
                    : 'bg-white border-slate-200 hover:border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Not Eligible
                  </span>
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <p className="text-3xl font-extrabold text-rose-950 mt-2">
                  {summary?.ineligibleCount || 0}
                </p>
                <p className="text-[11px] text-rose-700 mt-1">Age, income, or occupational limits unmet</p>
              </div>
            </div>

            {/* Tab selector */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                {['ALL', 'ELIGIBLE', 'LIKELY_ELIGIBLE', 'INELIGIBLE'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === tab
                        ? 'bg-gov-navy text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500">
                Showing <strong>{filteredResults.length}</strong> results
              </span>
            </div>

            {/* List of Evaluated Scheme Cards */}
            <div className="space-y-4">
              {filteredResults.map((item) => (
                <div
                  key={item.schemeId}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-card transition flex flex-col md:flex-row items-start justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gov-lightBlue text-gov-blue">
                        {item.category}
                      </span>
                      {item.schemeCode && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-orange-50 text-gov-saffron border border-orange-200">
                          {item.schemeCode}
                        </span>
                      )}
                      <EligibilityBadge status={item.status} score={item.matchScore} size="sm" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {item.schemeName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.ministry}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 inline-block text-xs font-bold text-slate-800">
                      💰 Benefit: <span className="text-emerald-700">{item.benefitAmount}</span>
                    </div>

                    {/* Explanations breakdown */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.positiveReasons?.length > 0 && (
                        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-900">
                          <p className="font-bold flex items-center gap-1 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Why you are eligible:
                          </p>
                          <ul className="space-y-0.5">
                            {item.positiveReasons.map((r, idx) => (
                              <li key={idx}>✓ {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.negativeReasons?.length > 0 && (
                        <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-[11px] text-rose-900">
                          <p className="font-bold flex items-center gap-1 mb-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Why you are not eligible:
                          </p>
                          <ul className="space-y-0.5">
                            {item.negativeReasons.map((r, idx) => (
                              <li key={idx}>✗ {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side actions */}
                  <div className="flex flex-col gap-2 w-full md:w-48 flex-shrink-0">
                    <Link
                      to={`/schemes/${item.schemeId}`}
                      className="w-full py-2 bg-gov-blue hover:bg-gov-navy text-white font-semibold text-xs rounded-xl transition text-center shadow-sm"
                    >
                      Full Details & Checklist
                    </Link>
                    <a
                      href={item.officialWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition text-center inline-flex items-center justify-center gap-1"
                    >
                      Official Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
