import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import { INDIAN_STATES, SCHEME_CATEGORIES } from '../utils/constants';
import api from '../services/api';

export default function Schemes() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [state, setState] = useState(searchParams.get('state') || 'All India');
  const [gender, setGender] = useState(searchParams.get('gender') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [page, setPage] = useState(1);

  const [schemes, setSchemes] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    if (searchParams.get('search') !== null) setSearch(searchParams.get('search'));
    if (searchParams.get('category') !== null) setCategory(searchParams.get('category'));
  }, [searchParams]);

  // Fetch schemes whenever filters or page change
  useEffect(() => {
    fetchSchemes();
  }, [search, category, level, state, gender, sort, page]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category && category !== 'All') params.append('category', category);
      if (level && level !== 'All') params.append('level', level);
      if (state && state !== 'All India') params.append('state', state);
      if (gender && gender !== 'All') params.append('gender', gender);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 9);

      const res = await api.get(`/schemes?${params.toString()}`);
      setSchemes(res.data.schemes || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
    setState('All India');
    setGender('All');
    setSort('popular');
    setPage(1);
    setSearchParams({});
  };

  const activeFilterCount =
    (category !== 'All' ? 1 : 0) +
    (level !== 'All' ? 1 : 0) +
    (state !== 'All India' ? 1 : 0) +
    (gender !== 'All' ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy">
              Government Schemes Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse authentic Central & State welfare initiatives, verify benefits, and discover prerequisites.
            </p>
          </div>
          
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Layout Grid: Sidebar Filters + Schemes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside className={`lg:block ${mobileFiltersOpen ? 'block mb-6' : 'hidden'} lg:col-span-1`}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card sticky top-28 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Filter className="w-4 h-4 text-gov-sky" />
                  Filter Schemes
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Search Keyword Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Keywords
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search name, ministry..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sector / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {SCHEME_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Level (Central / State) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Government Level
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  {['All', 'Central', 'State'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setLevel(lvl);
                        setPage(1);
                      }}
                      className={`py-1.5 rounded-lg font-medium transition ${
                        level === lvl
                          ? 'bg-white text-gov-navy shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  State / Jurisdiction
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Gender
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  {['All', 'Female', 'Male'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGender(g);
                        setPage(1);
                      }}
                      className={`py-1.5 rounded-lg font-medium transition ${
                        gender === g
                          ? 'bg-white text-gov-navy shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sort Order
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                >
                  <option value="popular">Featured / Most Popular</option>
                  <option value="name-asc">Scheme Name (A to Z)</option>
                  <option value="name-desc">Scheme Name (Z to A)</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Main Results Column */}
          <main className="lg:col-span-3">
            
            {/* Results bar */}
            <div className="bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between mb-6">
              <div className="text-xs text-slate-600">
                Showing <strong className="text-slate-900 font-semibold">{schemes.length}</strong> of{' '}
                <strong className="text-slate-900 font-semibold">{total}</strong> welfare programs
              </div>
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {category !== 'All' && (
                    <span className="text-[11px] bg-gov-lightBlue text-gov-blue px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      {category}
                      <button onClick={() => setCategory('All')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {state !== 'All India' && (
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      {state}
                      <button onClick={() => setState('All India')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Scheme Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse p-5" />
                ))}
              </div>
            ) : schemes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No matching schemes found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We could not find any active government schemes matching your current filter criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-lg transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes.map((scheme) => (
                  <SchemeCard key={scheme._id} scheme={scheme} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-600 px-3 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}
