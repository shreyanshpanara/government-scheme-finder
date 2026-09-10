import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  CheckCircle,
  Sparkles,
  Bot,
  Bookmark,
  FileText,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Tricolor top stripe */}
      <div className="tricolor-stripe" />

      {/* Top Gov Announcement Bar */}
      <div className="bg-gov-navyDark text-slate-300 text-[11px] py-1 px-4 sm:px-8 hidden md:flex justify-between items-center font-medium">
        <div className="flex items-center space-x-4">
          <span>🇮🇳 Government of India Citizen Welfare Initiative</span>
          <span>•</span>
          <span className="text-gov-saffron font-semibold">100% Direct Benefit Transfer (DBT) Compliant</span>
        </div>
        <div className="flex items-center space-x-4 text-slate-300">
          <span>Toll-Free National Helpline: <strong className="text-white">1800-11-0001</strong></span>
          <span>•</span>
          <Link to="/about" className="hover:text-white transition">About Portal</Link>
          <Link to="/contact" className="hover:text-white transition">Helpdesk</Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Portal Branding */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-gov-navy to-gov-blue flex items-center justify-center text-white shadow-md text-xl sm:text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
              🇮🇳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-gov-navy tracking-tight">
                  Yojana<span className="text-gov-saffron">Setu</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-gov-saffron px-2 py-0.5 rounded border border-orange-200">
                  National Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Government Scheme Discovery & Eligibility Engine
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
            <Link
              to="/schemes"
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isActive('/schemes')
                  ? 'bg-gov-lightBlue text-gov-blue font-semibold'
                  : 'text-slate-600 hover:text-gov-navy hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-gov-sky" />
              Find Schemes
            </Link>

            <Link
              to="/eligibility"
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isActive('/eligibility')
                  ? 'bg-gov-lightBlue text-gov-blue font-semibold'
                  : 'text-slate-600 hover:text-gov-navy hover:bg-slate-100'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Check Eligibility
            </Link>

            {isAuthenticated && (
              <Link
                to="/recommendations"
                className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                  isActive('/recommendations')
                    ? 'bg-gov-lightBlue text-gov-blue font-semibold'
                    : 'text-slate-600 hover:text-gov-navy hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Recommendations
              </Link>
            )}

            <Link
              to="/ai-assistant"
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isActive('/ai-assistant')
                  ? 'bg-orange-50 text-gov-saffron font-semibold'
                  : 'text-slate-600 hover:text-gov-saffron hover:bg-orange-50/50'
              }`}
            >
              <Bot className="w-4 h-4 text-gov-saffron" />
              AI Assistant
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/applications"
                  className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    isActive('/applications')
                      ? 'bg-gov-lightBlue text-gov-blue font-semibold'
                      : 'text-slate-600 hover:text-gov-navy hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  Applications
                </Link>

                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    isActive('/dashboard')
                      ? 'bg-gov-lightBlue text-gov-blue font-semibold'
                      : 'text-slate-600 hover:text-gov-navy hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-gov-navy" />
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* Right Section: Auth buttons / User Profile Dropdown */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 transition shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gov-blue text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user?.role === 'admin' ? 'National Admin' : 'Citizen'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      {user?.profileCompletion !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>Profile</span>
                            <span className="font-semibold">{user.profileCompletion}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${user.profileCompletion}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gov-sky" />
                      Citizen Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Manage Profile
                    </Link>

                    <Link
                      to="/saved-schemes"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Bookmark className="w-4 h-4 text-amber-500" />
                      Saved Schemes ({user?.savedSchemes?.length || 0})
                    </Link>

                    <Link
                      to="/applications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      Track Applications
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-red-700 hover:bg-red-50 transition font-medium border-t border-slate-100"
                      >
                        <Shield className="w-4 h-4 text-red-600" />
                        Admin Console
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gov-navy hover:text-gov-sky hover:bg-slate-50 rounded-lg transition"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-gov-saffron hover:bg-orange-600 text-white rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
          <Link
            to="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            <Search className="w-5 h-5 text-gov-sky" />
            Find Schemes
          </Link>
          <Link
            to="/eligibility"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Check Eligibility
          </Link>
          <Link
            to="/ai-assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            <Bot className="w-5 h-5 text-gov-saffron" />
            AI Assistant
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/recommendations"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                Recommendations
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                <LayoutDashboard className="w-5 h-5 text-gov-navy" />
                Citizen Dashboard
              </Link>
              <Link
                to="/saved-schemes"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                <Bookmark className="w-5 h-5 text-amber-500" />
                Saved Schemes
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                <FileText className="w-5 h-5 text-blue-500" />
                Track Applications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                <User className="w-5 h-5 text-slate-500" />
                My Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 font-medium"
                >
                  <Shield className="w-5 h-5 text-red-600" />
                  Admin Console
                </Link>
              )}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 font-medium hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 border border-slate-300 font-semibold text-slate-800 rounded-lg text-sm"
              >
                Citizen Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-gov-saffron font-semibold text-white rounded-lg text-sm shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
