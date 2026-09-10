import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, ExternalLink, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gov-navy text-slate-300 text-sm border-t border-slate-800 mt-auto">
      {/* Upper Footer: Official Portals & Quick Helplines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Mission */}
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-xl font-bold text-white tracking-tight">
                Yojana<span className="text-gov-saffron">Setu</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              An intelligent, rule-based Indian Government Scheme discovery and eligibility engine designed to bridge the gap between welfare policies and eligible citizens across India.
            </p>
            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gov-saffron" />
                <span>support@yojanasetu.gov.in</span>
              </div>
            </div>
          </div>

          {/* Column 2: Key National Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-gov-saffron" />
              National Government Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between">
                  <span>National Portal of India</span>
                  <span className="text-[10px] text-slate-500">india.gov.in</span>
                </a>
              </li>
              <li>
                <a href="https://www.mygov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between">
                  <span>MyGov Citizen Engagement</span>
                  <span className="text-[10px] text-slate-500">mygov.in</span>
                </a>
              </li>
              <li>
                <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between">
                  <span>National Scholarship Portal</span>
                  <span className="text-[10px] text-slate-500">scholarships.gov.in</span>
                </a>
              </li>
              <li>
                <a href="https://pmjay.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between">
                  <span>Ayushman Bharat PM-JAY</span>
                  <span className="text-[10px] text-slate-500">pmjay.gov.in</span>
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between">
                  <span>PM-KISAN Portal</span>
                  <span className="text-[10px] text-slate-500">pmkisan.gov.in</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Citizen Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Toll-Free Emergency Helplines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex justify-between items-center bg-slate-800/60 p-2 rounded-lg">
                <span>National Citizen Service</span>
                <strong className="text-white font-mono">1800-11-0001</strong>
              </li>
              <li className="flex justify-between items-center bg-slate-800/60 p-2 rounded-lg">
                <span>Kisan Call Centre</span>
                <strong className="text-white font-mono">1800-180-1551</strong>
              </li>
              <li className="flex justify-between items-center bg-slate-800/60 p-2 rounded-lg">
                <span>Ayushman Bharat Help</span>
                <strong className="text-white font-mono">14555</strong>
              </li>
              <li className="flex justify-between items-center bg-slate-800/60 p-2 rounded-lg">
                <span>National Consumer Helpline</span>
                <strong className="text-white font-mono">1915</strong>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Navigation & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-b border-slate-700 pb-2">
              Citizen Services
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <Link to="/schemes" className="hover:text-white transition">All Schemes</Link>
              <Link to="/eligibility" className="hover:text-white transition">Eligibility Checker</Link>
              <Link to="/ai-assistant" className="hover:text-white transition">AI Assistant</Link>
              <Link to="/recommendations" className="hover:text-white transition">Recommendations</Link>
              <Link to="/login" className="hover:text-white transition">Citizen Login</Link>
              <Link to="/register" className="hover:text-white transition">New Registration</Link>
              <Link to="/about" className="hover:text-white transition">About Project</Link>
              <Link to="/contact" className="hover:text-white transition">Grievance / Contact</Link>
            </div>

            <div className="mt-6 p-3 bg-slate-800/40 rounded-xl border border-slate-700 text-[11px] text-slate-400">
              <Shield className="w-4 h-4 text-amber-400 mb-1 inline mr-1" />
              <strong>Official Notice:</strong> YojanaSetu does not charge any fee. We connect you directly to authentic government application portals.
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & MCA Project Notice */}
      <div className="bg-gov-navyDark text-slate-400 text-xs py-5 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} YojanaSetu National Scheme Portal. Built with MERN Stack for Master of Computer Applications (MCA) Project.
          </p>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Powered by MongoDB, Express, React, Node.js & Rule Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
