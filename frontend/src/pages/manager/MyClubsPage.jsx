import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerApi } from '../../api/managerApi';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../../components/common/EmptyState';
import { ClubCardSkeleton } from '../../components/common/CardSkeleton';
import { Building2, Sparkles, AlertCircle, RefreshCw, Search, ChevronRight } from 'lucide-react';

const MyClubsPage = () => {
  const { isDark } = useTheme();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchMyClubs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await managerApi.getMyClubs();
      const clubList =
        res.data?.clubs ||
        res.clubs ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      setClubs(clubList);
    } catch (err) {
      if (err.response?.status === 403) {
        setClubs([]);
      } else {
        setError(err.response?.data?.message || 'Failed to load your assigned clubs.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'My Managed Clubs | 4 THE PEOPLE';
    fetchMyClubs();
  }, []);

  const filteredClubs = clubs.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${isDark
          ? 'bg-[#151D2A] border-slate-800 shadow-xl'
          : 'bg-white border-[#E2E0D5]'
        }`}>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5733]/10 text-[#FF5733] text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Club Portfolio</span>
          </div>
          <h1 className={`font-['Syne',sans-serif] text-3xl sm:text-4xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'
            }`}>
            My Managed <span className="text-[#FF5733]">Clubs</span>
          </h1>
          <p className={`text-xs font-medium max-w-xl ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
            Select a club to edit details, upload logos & cover photos, manage campus events, and organize photo galleries.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Filter clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-xs font-medium focus:outline-none focus:border-[#FF5733] ${isDark
                ? 'bg-[#0B0F17] border-slate-700 text-slate-100 placeholder-slate-500'
                : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A] placeholder-[#94A3B8]'
              }`}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${isDark ? 'bg-rose-950/40 border-rose-800 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchMyClubs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-black uppercase rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ClubCardSkeleton />
          <ClubCardSkeleton />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && clubs.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No Managed Clubs Assigned"
          description="You haven't been assigned to manage any clubs yet — contact an admin."
        />
      )}

      {/* Clubs Grid */}
      {!loading && !error && filteredClubs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => {
            const logoUrl = club.logo?.url;
            const initials = club.name ? club.name.slice(0, 2).toUpperCase() : 'CL';

            return (
              <div
                key={club.id}
                onClick={() => navigate(`/manager/clubs/${club.id}`)}
                className={`group border rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${isDark
                    ? 'bg-[#151D2A] hover:bg-[#1A2436] border-slate-800 hover:border-[#FF5733]/60'
                    : 'bg-white hover:bg-[#FAF9F5] border-[#E2E0D5] hover:border-[#FF5733]'
                  }`}
              >
                <div className="space-y-4">
                  {/* Header Logo */}
                  <div className="flex items-center gap-4">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={club.name}
                        className={`w-14 h-14 rounded-2xl object-cover border shadow-xs group-hover:scale-105 transition-transform ${isDark ? 'border-slate-700' : 'border-[#E2E0D5]'
                          }`}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-[#FF5733] flex items-center justify-center text-white font-['Syne',sans-serif] font-black text-xl shadow-md shadow-[#FF5733]/25 group-hover:scale-105 transition-transform">
                        {initials}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-['Syne',sans-serif] text-xl font-black group-hover:text-[#FF5733] transition truncate ${isDark ? 'text-white' : 'text-[#0F172A]'
                        }`}>
                        {club.name}
                      </h3>
                      <span className="text-[10px] text-[#3B82F6] font-black uppercase tracking-wider bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-[#3B82F6]/20">
                        Manager Access
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-xs line-clamp-3 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-[#64748B]'
                    }`}>
                    {club.description || 'No description provided for this club.'}
                  </p>
                </div>

                {/* Footer Link */}
                <div className={`pt-4 mt-6 border-t flex items-center justify-between text-xs ${isDark ? 'border-slate-800' : 'border-[#E8E6DF]'
                  }`}>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#64748B]'
                    }`}>
                    {club.members ? `${club.members.length} Members` : 'Manage Details'}
                  </span>
                  <div className="flex items-center gap-1 font-extrabold text-[#FF5733] group-hover:translate-x-1 transition-transform uppercase text-[11px] tracking-wider">
                    <span>Manage Club</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClubsPage;
