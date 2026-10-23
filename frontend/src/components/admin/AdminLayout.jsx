import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import InviteManagerModal from './InviteManagerModal';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex font-sans antialiased transition-colors duration-300 ${
      isDark ? 'bg-[#0B0F17] text-slate-100' : 'bg-[#FAF9F7] text-[#1C1B1F]'
    }`}>
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenInviteManager={() => setInviteModalOpen(true)}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Invite Manager Modal accessible from Sidebar */}
      <InviteManagerModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </div>
  );
};

export default AdminLayout;


