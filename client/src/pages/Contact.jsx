import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    showToast('Your inquiry has been submitted. Our citizen grievance cell will respond within 24-48 hours.', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gov-navy">
            Citizen Helpdesk & Grievance Cell
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Need assistance with scheme details or portal navigation? Reach out to our citizen support team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Phone className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-xs font-bold text-slate-800">National Helpline</p>
              <p className="text-sm font-mono font-extrabold text-gov-navy mt-1">1800-11-0001</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Toll-free 24x7</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Mail className="w-5 h-5 text-gov-sky mb-2" />
              <p className="text-xs font-bold text-slate-800">Grievance Email</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">support@yojanasetu.gov.in</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Response in 24-48 hrs</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <MapPin className="w-5 h-5 text-gov-saffron mb-2" />
              <p className="text-xs font-bold text-slate-800">Nodal Office</p>
              <p className="text-xs text-slate-600 mt-1">Ministry of Electronics & IT (MeitY) Complex, New Delhi - 110003</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gov-sky" />
              Send Citizen Inquiry
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Query regarding PM-KISAN land document requirement"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Message *</label>
                <textarea
                  rows="4"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Provide your query details..."
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-sky focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gov-blue hover:bg-gov-navy text-white font-bold rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Inquiry
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
