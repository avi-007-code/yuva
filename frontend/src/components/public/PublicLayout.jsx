import React from 'react';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import { useTheme } from '../../context/ThemeContext';

const PublicLayout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen font-sans selection:bg-[#00F0FF] selection:text-black antialiased flex flex-col justify-between overflow-x-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0B0C10] text-[#F3F4F6]' : 'bg-[#FAF9F5] text-[#0F172A]'
    }`}>
      <PublicNavbar />
      <main className="flex-1 w-full pt-20">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;

