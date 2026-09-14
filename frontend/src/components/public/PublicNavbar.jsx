import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Menu, X, ArrowUpRight, LogIn } from 'lucide-react';

const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0C10]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-black/60'
          : 'bg-[#0B0C10]/80 backdrop-blur-sm py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-white font-extrabold tracking-tight text-xl sm:text-2xl"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#3B82F6] flex items-center justify-center text-black font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-black fill-black" />
            </div>
            <span className="font-['Syne',sans-serif] tracking-wider text-white">
              CLUB<span className="text-[#00F0FF]">HUB</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-gray-300">
            <Link
              to="/"
              className={`transition-colors hover:text-[#00F0FF] ${
                location.pathname === '/' ? 'text-[#00F0FF]' : 'text-gray-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/clubs"
              className={`transition-colors hover:text-[#00F0FF] ${
                location.pathname.startsWith('/clubs') ? 'text-[#00F0FF]' : 'text-gray-300'
              }`}
            >
              Clubs Directory
            </Link>
          </nav>

          {/* Right Action & Portal Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Portal Login</span>
            </Link>

            <Link
              to="/clubs"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00F0FF] text-black font-extrabold text-xs uppercase tracking-wider overflow-hidden hover:bg-[#38f2ff] transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
              <span>Explore Clubs</span>
              <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#0F1117] border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-gray-200 font-semibold hover:bg-white/5 hover:text-[#00F0FF] transition-colors"
              >
                Home
              </Link>
              <Link
                to="/clubs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-gray-200 font-semibold hover:bg-white/5 hover:text-[#00F0FF] transition-colors"
              >
                Clubs Directory
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-gray-400 font-semibold hover:bg-white/5 hover:text-white transition-colors"
              >
                Portal Login
              </Link>

              <div className="pt-3 border-t border-white/10">
                <Link
                  to="/clubs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#00F0FF] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20"
                >
                  <Compass className="w-4 h-4 text-black" />
                  <span>Explore Clubs</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PublicNavbar;
