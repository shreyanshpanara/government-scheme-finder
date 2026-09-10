import React, { useState, useEffect } from 'react';
import { User, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  INDIAN_STATES,
  SOCIAL_CATEGORIES,
  OCCUPATIONS,
  EDUCATION_LEVELS
} from '../utils/constants';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    state: 'All India',
    district: '',
    category: 'General',
    occupation: 'Other',
    annualIncome: 0,
    education: 'Not Specified',
    maritalStatus: 'Not Specified',
    disabilityStatus: false,
    disabilityPercentage: 0,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || 'Prefer not to say',
        state: user.state || 'All India',
        district: user.district || '',
        category: user.category || 'General',
        occupation: user.occupation || 'Other',
        annualIncome: user.annualIncome || 0,
        education: user.education || 'Not Specified',
        maritalStatus: user.maritalStatus || 'Not Specified',
        disabilityStatus: Boolean(user.disabilityStatus),
        disabilityPercentage: user.disabilityPercentage || 0,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      showToast('Citizen profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const profilePct = user?.profileCompletion !== undefined ? user.profileCompletion : 60;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy">
            Citizen Profile Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your demographic and financial information up to date to ensure accurate automated scheme matching.
          </p>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gov-blue text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Role: {user?.role || 'Citizen'}
              </span>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Profile Completeness</span>
              <span>{profilePct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${profilePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Personal Details */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-gov-sky" />
                1. Personal Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full p-2.5 border rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Marital Status</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Not Specified">Not Specified</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Location & Residence */}
            <div className="pt-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                2. Residential Domicile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">State / Union Territory *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Varanasi / Patna / Pune"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Socio-Economic Profile */}
            <div className="pt-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                3. Socio-Economic Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Social Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  >
                    {SOCIAL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Primary Occupation *</label>
                  <select
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  >
                    {OCCUPATIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Annual Family Income (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    placeholder="e.g. 180000"
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Education Level</label>
                  <select
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  >
                    {EDUCATION_LEVELS.map((ed) => (
                      <option key={ed} value={ed}>{ed}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Disability Checkbox */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="disabilityProfileCheck"
                    checked={formData.disabilityStatus}
                    onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.checked })}
                    className="w-4 h-4 text-gov-sky rounded border-slate-300 focus:ring-gov-sky"
                  />
                  <label htmlFor="disabilityProfileCheck" className="text-xs font-semibold text-slate-700">
                    Person with Benchmark Disability (Divyangjan)
                  </label>
                </div>

                {formData.disabilityStatus && (
                  <div className="mt-3 max-w-xs text-xs">
                    <label className="block font-semibold text-slate-600 mb-1">Disability Percentage (%)</label>
                    <input
                      type="number"
                      min="40"
                      max="100"
                      value={formData.disabilityPercentage}
                      onChange={(e) => setFormData({ ...formData, disabilityPercentage: e.target.value })}
                      placeholder="e.g. 40"
                      className="w-full p-2 border rounded-lg bg-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
