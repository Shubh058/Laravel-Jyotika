import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [regionId, setRegionId] = useState('');
  const [regions, setRegions] = useState([]);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await api.get('/regions');
        setRegions(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRegions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        region_id: regionId || null,
      });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl leading-none">G</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500 mt-2">Join the GovFeedback 360 platform</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-900 outline-none transition-all" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-900 outline-none transition-all" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Region</label>
            <select value={regionId} onChange={(e) => setRegionId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-900 outline-none transition-all">
              <option value="">Select Region (Optional)</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.region_name} - {r.state}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-900 outline-none transition-all" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
            <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-900 outline-none transition-all" required />
          </div>

          <button type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm">
            Create Account
          </button>
        </form>

        <p className="text-center text-slate-600 dark:text-slate-400 mt-8 text-sm">
          Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
