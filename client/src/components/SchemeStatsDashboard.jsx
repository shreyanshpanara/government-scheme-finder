
import React, { useEffect, useState } from 'react';
import {
  Database,
  CheckCircle,
  CalendarPlus,
} from 'lucide-react';
import api from '../services/api';

export default function SchemeStatsDashboard() {
  const [stats, setStats] = useState({
    totalRecords: 0,
    activeRecords: 0,
    recordsAddedToday: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/schemes/stats');

        setStats(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Stats load કરવામાં નિષ્ફળતા. ફરી પ્રયાસ કરો.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Records',
      value: stats.totalRecords,
      icon: Database,
      color: 'text-blue-600',
    },
    {
      title: 'Active Records',
      value: stats.activeRecords,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Records Added Today',
      value: stats.recordsAddedToday,
      icon: CalendarPlus,
      color: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-slate-600">
          Loading dashboard statistics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="bg-red-50 border border-red-200
                   rounded-xl p-5 text-red-700"
      >
        <p className="font-semibold">Error loading statistics</p>
        <p className="mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-600
                     text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">
        Scheme Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2
                      lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white p-6 rounded-2xl
                         border border-slate-200 shadow-sm"
            >
              <div className="flex items-center
                              justify-between gap-3">
                <span className="text-sm font-semibold
                                 text-slate-500">
                  {card.title}
                </span>

                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>

              <p className="text-3xl font-extrabold
                            text-slate-900 mt-4">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
