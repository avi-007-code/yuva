import React from 'react';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] font-sans selection:bg-[#00F0FF] selection:text-black antialiased flex flex-col justify-between overflow-x-hidden">
      <PublicNavbar />
      <main className="flex-1 w-full pt-20">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
