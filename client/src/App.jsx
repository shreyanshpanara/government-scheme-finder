import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components & Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Schemes from './pages/Schemes';
import SchemeDetails from './pages/SchemeDetails';
import EligibilityChecker from './pages/EligibilityChecker';
import PersonalizedRecommendations from './pages/PersonalizedRecommendations';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SavedSchemes from './pages/SavedSchemes';
import Applications from './pages/Applications';
import AIAssistant from './pages/AIAssistant';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminSchemes from './pages/AdminSchemes';
import AdminSchemeForm from './pages/AdminSchemeForm';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Public Discovery Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/schemes" element={<Schemes />} />
                <Route path="/schemes/:id" element={<SchemeDetails />} />
                <Route path="/eligibility" element={<EligibilityChecker />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Citizen Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <ProtectedRoute>
                      <PersonalizedRecommendations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved-schemes"
                  element={
                    <ProtectedRoute>
                      <SavedSchemes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute>
                      <Applications />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Console Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/schemes"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminSchemes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/schemes/new"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminSchemeForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/schemes/edit/:id"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminSchemeForm />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
