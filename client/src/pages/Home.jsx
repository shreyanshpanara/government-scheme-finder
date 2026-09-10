import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Building2,
  Wheat,
  HeartPulse,
  GraduationCap,
  Home as HomeIcon,
  Baby,
  Briefcase,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import api from '../services/api';

const CATEGORY_ITEMS = [
  { name: 'Agriculture & Rural', icon: Wheat, color: 'text-emerald-600 bg-emerald-50', count: 'PM-KISAN & KCC' },
  { name: 'Health & Wellness', icon: HeartPulse, color: 'text-rose-600 bg-rose-50', count: 'Ayushman Bharat & PM-JAY' },
  { name: 'Education & Learning', icon: GraduationCap, color: 'text-blue-600 bg-blue-50', count: 'NSP Scholarships' },
  { name: 'Housing & Shelter', icon: HomeIcon, color: 'text-amber-600 bg-amber-50', count: 'PMAY Gramin & Urban' },
  { name: 'Women & Child', icon: Baby, color: 'text-pink-600 bg-pink-50', count: 'Sukanya Samriddhi' },
  { name: 'Business & MSME', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50', count: 'MUDRA & Stand-Up India' },
  { name: 'Social Welfare & Empowerment', icon: Layers, color: 'text-purple-600 bg-purple-50', count: 'Atal Pension & Divyangjan' }
];

export default function Home() {
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/schemes?limit=6&sort=popular')
      .then((res) => {
        setFeaturedSchemes(res.data.schemes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching featured schemes:', err);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/schemes');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-gov-navy to-gov-blue text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-gov-saffron/10 blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-200 text-xs font-semibold mb-6">
            <span className="text-base">🇮🇳</span>
            <span>Government Scheme Discovery & Automated Eligibility Matching</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
            Discover Government Schemes <br className="hidden sm:inline" />
            <span className="text-gov-saffron">Tailored For You & Your Family</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-light">
            Empowering 140+ Crore Indian citizens to check eligibility, discover Central & State subsidies, and apply directly on verified government portals.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2.5 p-2 bg-white rounded-2xl shadow-2xl">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keyword: PM-KISAN, Scholarship, Mudra, Housing..."
                  className="w-full pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gov-saffron hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 flex-shrink-0"
              >
                <span>Find Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Popular search pills */}
            <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-300">
              <span className="font-semibold text-slate-200">Popular:</span>
              {['PM-KISAN', 'Ayushman Bharat', 'Post-Matric Scholarship', 'PMAY Housing', 'MUDRA Loan'].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => navigate(`/schemes?search=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition text-[11px]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Key Trust Badges */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">100% Authentic</p>
                <p className="text-[11px] text-slate-300">Official Gov Sources</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-gov-saffron" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Rule-Based Engine</p>
                <p className="text-[11px] text-slate-300">Transparent Matching</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">AI Assistant</p>
                <p className="text-[11px] text-slate-300">Instant Citizen Help</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Direct Benefits</p>
                <p className="text-[11px] text-slate-300">Zero Middlemen</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SCHEME CATEGORIES EXPLORER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gov-sky">Explore By Sector</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-gov-navy mt-1">
            Welfare Schemes Across Key Domains
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Select a sector to browse government initiatives designed for your occupation and livelihood.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORY_ITEMS.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => navigate(`/schemes?category=${encodeURIComponent(cat.name)}`)}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-cardHover hover:border-gov-sky transition-all duration-300 text-left flex items-start gap-4 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-gov-blue transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. QUICK ELIGIBILITY CHECKER PROMO BANNER */}
      <section className="bg-gradient-to-r from-gov-navy via-gov-blue to-gov-sky text-white py-12 px-4 sm:px-6 lg:px-8 my-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
              Automated Eligibility Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 leading-snug">
              Don't know which schemes you qualify for?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base mt-2">
              Answer 4 simple questions about your age, state, occupation, and family income to get a personalized breakdown of all eligible welfare programs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/eligibility"
              className="px-6 py-3.5 bg-gov-saffron hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Check My Eligibility Now
            </Link>
            <Link
              to="/ai-assistant"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition border border-white/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED POPULAR SCHEMES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gov-sky">Flagship Programs</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-gov-navy mt-1">
              Top Government Initiatives
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Essential welfare schemes with maximum citizen impact and direct benefit transfers.
            </p>
          </div>
          <Link
            to="/schemes"
            className="text-xs font-bold text-gov-sky hover:text-gov-navy transition inline-flex items-center gap-1"
          >
            View All Schemes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme) => (
              <SchemeCard key={scheme._id} scheme={scheme} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gov-sky">Simple 3-Step Process</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-gov-navy mt-1">
            How YojanaSetu Helps You
          </p>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            From discovering eligibility to tracking applications on verified government portals.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-gov-lightBlue text-gov-blue font-bold flex items-center justify-center text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Enter Citizen Profile</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Provide basic details like age, gender, occupation, family annual income, and state of residence. Your data remains secure on your portal.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-gov-saffron font-bold flex items-center justify-center text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Get Instant Match & Reasons</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Our rule-based engine scores and explains exactly why you are eligible or what documents are needed, eliminating guesswork.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Apply & Track Benefits</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Access verified official application portals with complete step-by-step checklists, and track your application status on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
