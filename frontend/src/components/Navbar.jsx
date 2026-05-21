import { useState } from 'react';
import { useAuth } from '../context/auth';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar h-16 flex items-center justify-between px-4 lg:px-8 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md shadow-primary-200 group-hover:shadow-lg group-hover:shadow-primary-300 transition-all">
            <span className="text-white font-black text-lg leading-none">G</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight text-slate-800">Gov</span>
            <span className="font-bold text-lg tracking-tight text-gradient">Feedback</span>
            <span className="font-medium text-xs text-slate-400 ml-1">360</span>
          </div>
        </Link>
      </div>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-1">
        <Link to="/news" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/news' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`}>
          News Feed
        </Link>
        {user && (
          <Link to="/dashboard" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`}>
            Dashboard
          </Link>
        )}
        {user && (user.role === 'admin' || user.role === 'analyst') && (
          <Link to="/analytics" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/analytics' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`}>
            Analytics
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full"></span>
            </button>
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                <span className="text-xs text-slate-400 capitalize">{user.role}</span>
              </div>
            </div>
            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm !px-5 !py-2">
              Get Started
            </Link>
          </div>
        )}

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden z-40 p-4 space-y-1">
          <Link to="/news" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">News Feed</Link>
          {user && <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Dashboard</Link>}
          {user && (user.role === 'admin' || user.role === 'analyst') && <Link to="/analytics" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Analytics</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
