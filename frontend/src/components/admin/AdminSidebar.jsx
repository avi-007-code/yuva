import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, X } from 'lucide-react';

const AdminSidebar = ({ mobileOpen, setMobileOpen, onOpenInviteManager }) => {
  const { user, logout } = useAuth();

  const navSections = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin', end: true },
        { label: 'My Profile', path: '/admin/profile' },
      ],
    },
    {
      title: 'Users',
      items: [
        { label: 'All Users', path: '/admin/users' },
      ],
    },
    {
      title: 'Clubs',
      items: [
        { label: 'All Clubs', path: '/admin/clubs', end: true },
        { label: 'Create Club', path: '/admin/clubs/create' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#1C1B1F]/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1C1B1F] text-[#F5F3EF] flex flex-col justify-between transition-transform duration-300 ease-in-out transform border-r border-[#2D2C30] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#2D2C30]">
            <div>
              <h1 className="text-base font-semibold text-[#F5F3EF] leading-tight font-serif tracking-tight">
                Admin Portal
              </h1>
              <p className="text-[11px] text-[#A8A5A0] font-sans">Club Event Manager</p>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-[#A8A5A0] hover:text-[#F5F3EF] p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sections */}
          <nav className="py-6 px-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] font-sans">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <p className="px-3 text-xs font-medium text-[#8E8B85]">
                  {section.title}
                </p>
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2 text-sm transition-colors border-l-2 ${
                        isActive
                          ? 'border-[#B08D57] text-[#F5F3EF] font-semibold'
                          : 'border-transparent text-[#C5C2BC] hover:text-[#F5F3EF]'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}

            {/* Managers Section */}
            <div className="space-y-1 pt-2">
              <p className="px-3 text-xs font-medium text-[#8E8B85]">
                Managers
              </p>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  if (onOpenInviteManager) onOpenInviteManager();
                }}
                className="w-full text-left px-3.5 py-2 text-sm border-l-2 border-transparent text-[#C5C2BC] hover:text-[#F5F3EF] transition-colors"
              >
                Create Manager
              </button>
            </div>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#2D2C30] space-y-3 font-sans">
          {user && (
            <div className="px-3 py-2 bg-[#252429] rounded border border-[#2D2C30] flex items-center gap-2.5">
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded bg-[#B08D57] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {(user.name || 'Admin User').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#F5F3EF] truncate">{user.name || 'Admin User'}</p>
                <p className="text-[11px] text-[#A8A5A0] truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#252429] hover:bg-[#2D2C30] text-[#D4D1CB] text-xs font-medium rounded border border-[#2D2C30] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

