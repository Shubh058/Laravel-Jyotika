import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const canViewStats = user?.role === 'admin' || user?.role === 'analyst';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canViewStats) {
      return;
    }
    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/overview');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [canViewStats]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user?.name}</p>
        </div>
      </div>

      {canViewStats ? (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 h-32 rounded-xl border border-slate-200 dark:border-slate-700"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-sm font-medium text-slate-500">Total Feedback</span>
              <span className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats?.total_feedback || 0}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-sm font-medium text-slate-500">Active News Stories</span>
              <span className="text-3xl font-bold text-primary-600 mt-2">{stats?.total_news || 0}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-sm font-medium text-slate-500">Average Rating</span>
              <span className="text-3xl font-bold text-accent-600 mt-2">{stats?.average_rating || '0.0'}/5</span>
            </div>
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">My Activity</h3>
          <p className="text-slate-500">View news stories to start submitting feedback.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
