import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Users, CheckCircle2, Heart, ExternalLink, Code } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-3xl">🇮🇳</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gov-navy mt-2">
            About YojanaSetu National Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Indian Citizen Government Scheme Discovery, Automated Eligibility Engine, and Welfare Gateway
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every year, the Government of India and various State Governments allocate hundreds of thousands of crores to welfare programs covering healthcare, agriculture, housing, education, and entrepreneurship. However, a huge percentage of eligible citizens miss out simply due to lack of awareness or confusion regarding complex eligibility rules.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
              <strong>YojanaSetu</strong> was developed to eliminate this information asymmetry by creating an automated, transparent rule-based eligibility evaluation engine. Citizens simply enter their demographic parameters and instantly discover which subsidies and benefits they qualify for—with zero middlemen and direct links to official government application portals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-2xl font-extrabold text-gov-blue">140+ Cr</p>
              <p className="text-xs text-slate-500 mt-0.5">Indian Citizens Empowered</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-2xl font-extrabold text-gov-saffron">100% DBT</p>
              <p className="text-xs text-slate-500 mt-0.5">Direct Benefit Transfers</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-2xl font-extrabold text-emerald-700">Zero</p>
              <p className="text-xs text-slate-500 mt-0.5">Middlemen & Brokerage</p>
            </div>
          </div>
        </div>

        {/* Technology & Architecture Section (MCA standard) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-gov-sky" />
            Engineering & Technology Stack
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Built as a modern, production-caliber full-stack web application adhering to industrial standards:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-900 mb-1">Frontend Engineering</p>
              <p className="text-slate-600">React.js, Vite, Tailwind CSS, React Router v6, Axios, Lucide Icons, and Mobile-First Responsive Layouts.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-900 mb-1">Backend & Security</p>
              <p className="text-slate-600">Node.js, Express.js, MongoDB / Mongoose, JWT Authentication, Bcrypt password encryption, and Role-Based Authorization.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-900 mb-1">Rule-Based Eligibility Engine</p>
              <p className="text-slate-600">Deterministic scoring algorithm calculating match percentages (0-100%) and producing positive/negative reasoning breakdowns.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-900 mb-1">AI Assistant Architecture</p>
              <p className="text-slate-600">Pluggable LLM abstraction service (Gemini API) supported by an offline schema-grounded knowledge base to prevent hallucinations.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
