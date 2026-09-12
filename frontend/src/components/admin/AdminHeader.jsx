import React from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AdminHeader = ({ onMenuClick }) => {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/profile') return 'My Profile';
    if (path.startsWith('/admin/users')) return 'Users';
    if (path === '/admin/clubs/create') return 'Clubs / Create';
    if (path.startsWith('/admin/clubs')) return 'Clubs';
    return 'Admin';
  };

  return (
    <header className="h-16 px-6 sm:px-8 bg-[#FAF9F7] border-b border-[#E7E5E4] flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[#6B6966] hover:text-[#1C1B1F] p-2 rounded hover:bg-[#F2F0EC] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B6966]">
          <span>Admin</span>
          <span className="text-[#A8A5A0]">/</span>
          <span className="text-[#1C1B1F] font-medium">{getBreadcrumbs()}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

