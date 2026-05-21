import { NavLink } from 'react-router-dom';
import { Newspaper, BarChart3, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/auth';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { name: 'News Feed', to: '/news', icon: Newspaper, roles: ['user', 'admin', 'analyst'] },
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['user'] },
    { name: 'Analytics', to: '/analytics', icon: BarChart3, roles: ['admin', 'analyst'] },
    { name: 'Settings', to: '/settings', icon: Settings, roles: ['admin', 'user', 'analyst'] },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden lg:flex flex-col z-0 pt-16 mt-[-64px]">
      <div className="flex-1 py-6 px-4 overflow-y-auto mt-16">
        <div className="space-y-1">
          {links.map((link) => {
            if (!link.roles.includes(user?.role || 'user')) return null;
            return (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50'
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
