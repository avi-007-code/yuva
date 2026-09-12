import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, LayoutDashboard, LogOut, Sparkles, Menu, X, User as UserIcon, ChevronRight } from 'lucide-react';

const ManagerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const managerUser = user;

  const handleLogout = () => {
    logout();
    navigate('/login/manager');
  };

  const navItems = [
    { label: 'Dashboard', path: '/manager', icon: LayoutDashboard },
    { label: 'My Clubs', path: '/manager/clubs', icon: Building2 },
    { label: 'Profile Settings', path: '/manager/profile', icon: UserIcon },
  ];

  const getBreadcrumb = () => {
    if (location.pathname === '/manager') return 'Dashboard';
    if (location.pathname === '/manager/profile') return 'Profile Settings';
    if (location.pathname.startsWith('/manager/clubs/')) return 'Club Details';
    if (location.pathname === '/manager/clubs') return 'My Clubs';
    return 'Overview';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-xl shadow-md shadow-purple-500/20 text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white leading-tight">Manager Portal</h1>
                <p className="text-[11px] text-purple-400 font-medium">Club Event Manager</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/manager'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-md'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {managerUser && (
            <div
              onClick={() => {
                navigate('/manager/profile');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 cursor-pointer transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs flex-shrink-0 group-hover:border-purple-400 transition">
                {managerUser.name ? managerUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white group-hover:text-purple-300 transition truncate">{managerUser.name || 'Manager'}</p>
                <p className="text-[11px] text-slate-400 truncate">{managerUser.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 border border-slate-700/60 text-slate-300 text-sm font-semibold rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header className="h-16 px-6 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs text-slate-400 font-medium">
              Manager Portal / <span className="text-white font-bold">{getBreadcrumb()}</span>
            </div>
          </div>
        </header>

        {/* Viewport Outlet */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
