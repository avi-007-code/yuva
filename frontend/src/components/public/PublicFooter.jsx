import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-white font-bold text-base tracking-tight">CampusPulse</p>
            <p className="text-xs text-slate-500">Connecting student clubs & events</p>
          </div>
        </div>

        {/* Center Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/clubs" className="hover:text-white transition">Clubs Directory</Link>
          <Link to="/login/manager" className="text-xs text-slate-500 hover:text-slate-300 transition font-normal">Staff Login</Link>
        </div>

        {/* Right Copyright */}
        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} CampusPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
