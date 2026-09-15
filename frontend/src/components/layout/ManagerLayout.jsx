import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  ChevronRight,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';

const ManagerLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
    <div className={`min-h-screen flex font-sans antialiased transition-colors duration-300 ${isDark ? 'bg-[#0B0F17] text-slate-100 dark' : 'bg-[#FAF9F5] text-[#0F172A]'
      }`}>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r flex flex-col justify-between transition-all duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${isDark
            ? 'bg-[#151D2A] border-slate-800/80 shadow-2xl'
            : 'bg-white border-[#E2E0D5] shadow-sm'
          }`}
      >
        <div>
          {/* Brand Header */}
          <div className={`py-4 px-6 flex items-center justify-between border-b ${isDark ? 'border-slate-800/80' : 'border-[#E8E6DF]'
            }`}>
            <div
              onClick={() => navigate('/manager')}
              className="flex flex-col gap-1 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5733] flex items-center justify-center text-white font-black shadow-lg shadow-[#FF5733]/30 group-hover:scale-105 transition-transform shrink-0">
                  <span className="font-['Syne',sans-serif] text-2xl font-black leading-none">4</span>
                </div>
                <div className="flex flex-col justify-center leading-none">
                  <span className="text-[10px] font-black tracking-[0.25em] text-[#FF5733] uppercase leading-none mb-0.5">
                    THE
                  </span>
                  <span className={`font-['Syne',sans-serif] text-xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    PEOPLE<span className="text-[#FF5733]">.</span>
                  </span>
                </div>
              </div>
              <div className="pl-[50px]">
                <span className="text-[8px] font-black uppercase tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full inline-block border border-[#3B82F6]/20">
                  Club Manager
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`lg:hidden ${isDark ? 'text-slate-400 hover:text-white' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/manager'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all ${isActive
                      ? isDark
                        ? 'bg-[#FF5733] text-white shadow-lg shadow-[#FF5733]/25'
                        : 'bg-[#0F172A] text-white shadow-md'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                        : 'text-[#64748B] hover:bg-[#F0EEE6] hover:text-[#0F172A]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Controls: Theme Switcher & User Profile */}
        <div className={`p-4 border-t space-y-3 ${isDark ? 'border-slate-800/80' : 'border-[#E8E6DF]'
          }`}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${isDark
                ? 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:text-white'
                : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A] hover:bg-[#F0EEE6]'
              }`}
            title="Toggle Light / Dark Mode"
          >
            <span className="flex items-center gap-2">
              {isDark ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
            </span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-500/20 text-amber-700'
              }`}>
              {isDark ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Public Portal link */}
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition ${isDark
                ? 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A] hover:bg-[#F0EEE6]'
              }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5733]" />
              <span>Public Portal</span>
            </span>
            <ExternalLink className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`} />
          </button>

          {/* Profile Quick Access */}
          {managerUser && (
            <div
              onClick={() => {
                navigate('/manager/profile');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl border cursor-pointer transition group shadow-xs ${isDark
                  ? 'bg-slate-800/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  : 'bg-white hover:bg-[#FAF9F5] border-[#E2E0D5]'
                }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/30 flex items-center justify-center text-[#FF5733] font-black text-xs flex-shrink-0 group-hover:bg-[#FF5733] group-hover:text-white transition-all">
                {managerUser.name ? managerUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden flex-1">
                <p className={`text-xs font-bold group-hover:text-[#FF5733] transition truncate ${isDark ? 'text-slate-100' : 'text-[#0F172A]'
                  }`}>
                  {managerUser.name || 'Club Manager'}
                </p>
                <p className={`text-[10px] truncate font-medium ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                  {managerUser.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-rose-500 hover:text-white border text-xs font-extrabold uppercase tracking-wider rounded-2xl transition-all cursor-pointer ${isDark
                ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#64748B]'
              }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header className={`h-16 px-6 border-b flex items-center justify-between sticky top-0 z-30 backdrop-blur-md transition-colors ${isDark
            ? 'bg-[#151D2A]/90 border-slate-800 text-slate-100'
            : 'bg-white/90 border-[#E8E6DF] text-[#0F172A]'
          }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-xl border ${isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#64748B]'
                }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="uppercase text-[10px] font-black px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                Manager Workspace
              </span>
              <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>/</span>
              <span className={`uppercase tracking-wider font-extrabold ${isDark ? 'text-slate-200' : 'text-[#0F172A]'}`}>
                {getBreadcrumb()}
              </span>
            </div>
          </div>

          {/* Quick Theme Toggle Icon Header Shortcut */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-extrabold ${isDark
                ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-[#FAF9F5] border-[#E2E0D5] text-purple-600 hover:bg-[#F0EEE6]'
              }`}
            title="Toggle theme mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
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
