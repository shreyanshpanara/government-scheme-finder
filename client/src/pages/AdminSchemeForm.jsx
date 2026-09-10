import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Building2 } from 'lucide-react';
import { INDIAN_STATES, SCHEME_CATEGORIES } from '../utils/constants';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function AdminSchemeForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    ministry: '',
    category: 'Agriculture & Rural',
    level: 'Central',
    state: 'All India',
    description: '',
    benefitAmount: '',
    benefits: [''],
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: '',
      allowedOccupations: ['All'],
      allowedCategories: ['All'],
    },
    documentsRequired: [{ name: 'Aadhaar Card', mandatory: true, description: 'Identity proof' }],
    applicationProcess: {
      mode: 'Online',
      steps: ['Visit official portal and submit online form.'],
      officialPortalUrl: '',
    },
    officialWebsite: '',
    helpline: '1800-11-0001',
    tags: '',
    active: true,
    featured: false,
  });

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      api.get(`/schemes/${id}`)
        .then((res) => {
          const s = res.data.scheme;
          setFormData({
            ...s,
            tags: Array.isArray(s.tags) ? s.tags.join(', ') : (s.tags || ''),
            benefits: s.benefits?.length ? s.benefits : [''],
            eligibilityCriteria: {
              ...s.eligibilityCriteria,
              maxAnnualIncome: s.eligibilityCriteria?.maxAnnualIncome || '',
            },
            documentsRequired: s.documentsRequired?.length ? s.documentsRequired : [{ name: '', mandatory: true }],
            applicationProcess: {
              ...s.applicationProcess,
              steps: s.applicationProcess?.steps?.length ? s.applicationProcess.steps : [''],
            },
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading scheme for edit:', err);
          showToast('Failed to load scheme details.', 'error');
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
          : formData.tags,
        benefits: formData.benefits.filter((b) => b.trim() !== ''),
        eligibilityCriteria: {
          ...formData.eligibilityCriteria,
          maxAnnualIncome: formData.eligibilityCriteria.maxAnnualIncome ? Number(formData.eligibilityCriteria.maxAnnualIncome) : null,
        },
        documentsRequired: formData.documentsRequired.filter((d) => d.name.trim() !== ''),
        applicationProcess: {
          ...formData.applicationProcess,
          steps: formData.applicationProcess.steps.filter((st) => st.trim() !== ''),
        },
      };

      if (isEditMode) {
        await api.put(`/schemes/${id}`, payload);
        showToast('Scheme updated successfully!', 'success');
      } else {
        await api.post('/schemes', payload);
        showToast('New government scheme created successfully!', 'success');
      }
      navigate('/admin/schemes');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving scheme.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gov-navy"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link
          to="/admin/schemes"
          className="text-xs font-semibold text-slate-500 hover:text-gov-navy flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Schemes Management
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1">
            {isEditMode ? 'Edit Government Scheme' : 'Add New Government Scheme'}
          </h1>
          <p className="text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">
            Configure welfare parameters, rule engine criteria, and citizen documentation requirements.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
            
            {/* 1. Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-xs mb-1">
                  Scheme Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pradhan Mantri Kisan Samman Nidhi"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-xs mb-1">
                  Scheme Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. PM-KISAN"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-xs mb-1">
                  Ministry *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ministry}
                  onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                  placeholder="e.g. Ministry of Agriculture & Farmers Welfare"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-xs mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {SCHEME_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-xs mb-1">
                  Benefit Amount / Package *
                </label>
                <input
                  type="text"
                  required
                  value={formData.benefitAmount}
                  onChange={(e) => setFormData({ ...formData, benefitAmount: e.target.value })}
                  placeholder="e.g. ₹6,000 / year or ₹5 Lakh cashless cover"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-xs mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of the scheme mission and purpose..."
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Eligibility Criteria */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                Eligibility Engine Rules
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Min Age</label>
                  <input
                    type="number"
                    value={formData.eligibilityCriteria.minAge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityCriteria: { ...formData.eligibilityCriteria, minAge: Number(e.target.value) },
                      })
                    }
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Max Age</label>
                  <input
                    type="number"
                    value={formData.eligibilityCriteria.maxAge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityCriteria: { ...formData.eligibilityCriteria, maxAge: Number(e.target.value) },
                      })
                    }
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Target Gender</label>
                  <select
                    value={formData.eligibilityCriteria.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityCriteria: { ...formData.eligibilityCriteria, gender: e.target.value },
                      })
                    }
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  >
                    <option value="All">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Max Annual Income (₹)</label>
                  <input
                    type="number"
                    value={formData.eligibilityCriteria.maxAnnualIncome}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityCriteria: { ...formData.eligibilityCriteria, maxAnnualIncome: e.target.value },
                      })
                    }
                    placeholder="Leave empty for no limit"
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Allowed Occupations</label>
                  <input
                    type="text"
                    value={formData.eligibilityCriteria.allowedOccupations?.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityCriteria: {
                          ...formData.eligibilityCriteria,
                          allowedOccupations: e.target.value.split(',').map((s) => s.trim()),
                        },
                      })
                    }
                    placeholder="e.g. Farmer, Student or All"
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Allowed Social Categories</label>
                  <input
                    type="text"
                    value={formData.eligibilityCriteria.allowedCategories?.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eligibilityCriteria: {
                          ...formData.eligibilityCriteria,
                          allowedCategories: e.target.value.split(',').map((s) => s.trim()),
                        },
                      })
                    }
                    placeholder="e.g. SC, ST, OBC or All"
                    className="w-full p-2 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* 3. Official Links & Helpline */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Official Website URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.officialWebsite}
                  onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                  placeholder="https://pmkisan.gov.in"
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Citizen Helpline Number
                </label>
                <input
                  type="text"
                  value={formData.helpline}
                  onChange={(e) => setFormData({ ...formData, helpline: e.target.value })}
                  placeholder="1800-11-0001"
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Target State / Jurisdiction
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. kisan, farmer, dbt, rural"
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>
            </div>

            {/* 4. Flags: Active / Featured */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-gov-sky rounded"
                />
                <span className="text-xs font-semibold text-slate-700">Scheme is Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-gov-sky rounded"
                />
                <span className="text-xs font-semibold text-slate-700">Display as Featured on Homepage</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <Link
                to="/admin/schemes"
                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving Scheme...' : isEditMode ? 'Update Scheme' : 'Publish Scheme'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
