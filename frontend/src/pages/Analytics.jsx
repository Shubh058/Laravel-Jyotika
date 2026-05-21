import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [regions, setRegions] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, regionsRes, trendsRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/regions'),
          api.get('/analytics/trends')
        ]);
        
        setOverview(overviewRes.data);
        setRegions(regionsRes.data);
        setTrends(trendsRes.data);
      } catch (error) {
        console.error("Failed to load analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading Analytics...</div>;
  }

  // Sentiment Doughnut Chart Data
  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          overview?.sentiment?.positive || 0,
          overview?.sentiment?.neutral || 0,
          overview?.sentiment?.negative || 0,
        ],
        backgroundColor: [
          '#10b981', // Emerald 500 (Positive)
          '#64748b', // Slate 500 (Neutral)
          '#ef4444', // Red 500 (Negative)
        ],
        borderWidth: 0,
      },
    ],
  };

  // Region Bar Chart Data
  const regionData = {
    labels: regions.map(r => r.region_name),
    datasets: [
      {
        label: 'Feedback Count',
        data: regions.map(r => r.feedback_count),
        backgroundColor: '#3b82f6', // Primary 500
        borderRadius: 4,
      }
    ]
  };

  // Trends Line Chart Data
  const trendsData = {
    labels: trends.map(t => t.date),
    datasets: [
      {
        label: 'Daily Feedback',
        data: trends.map(t => t.count),
        borderColor: '#f97316', // Accent 500
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">360-degree feedback insights across regional media.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Feedback Trends (Last 30 Days)</h3>
          <div className="h-64">
            {trends.length > 0 ? <Line data={trendsData} options={chartOptions} /> : <div className="h-full flex items-center justify-center text-slate-500">No data available</div>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Overall Sentiment</h3>
          <div className="h-64">
            <Doughnut data={sentimentData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-3">
          <h3 className="text-lg font-bold mb-4">Regional Engagement</h3>
          <div className="h-80">
             {regions.length > 0 ? <Bar data={regionData} options={chartOptions} /> : <div className="h-full flex items-center justify-center text-slate-500">No data available</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
