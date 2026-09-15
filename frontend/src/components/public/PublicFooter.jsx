import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer className="mt-auto bg-[#08090C] text-gray-400 py-16 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">

          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-extrabold tracking-tight">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00F0FF] to-[#3B82F6] flex items-center justify-center text-black font-black shadow-lg shadow-cyan-500/20 shrink-0">
                <span className="font-['Syne',sans-serif] text-2xl font-black leading-none">4</span>
              </div>
              <div className="flex flex-col justify-center leading-none font-['Syne',sans-serif]">
                <span className="text-[10px] font-black tracking-[0.25em] text-[#00F0FF] uppercase leading-none mb-0.5">
                  THE
                </span>
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  PEOPLE<span className="text-[#00F0FF]">.</span>
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Discover campus clubs, manage vibrant events, and empower student leadership with 4 THE PEOPLE.
            </p>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-['Syne',sans-serif] text-white text-xs font-extrabold uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-[#00F0FF] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/clubs" className="hover:text-[#00F0FF] transition-colors">
                  Clubs Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals Link */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-['Syne',sans-serif] text-white text-xs font-extrabold uppercase tracking-widest">
              Manager Access
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/login/manager" className="hover:text-[#00F0FF] transition-colors">
                  Manager Portal Login
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} 4 THE PEOPLE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default PublicFooter;
