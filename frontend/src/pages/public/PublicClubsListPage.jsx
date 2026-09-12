import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../api/publicApi';
import PublicLayout from '../../components/public/PublicLayout';
import EmptyState from '../../components/common/EmptyState';
import { ClubCardSkeleton } from '../../components/common/CardSkeleton';
import { getCloudinaryUrl, CLOUDINARY_TRANSFORMS } from '../../utils/cloudinary';
import { Compass, Search, Building2, Users, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

const PublicClubsListPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await publicApi.getClubs();
      const clubList =
        res.data?.clubs ||
        res.clubs ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      setClubs(clubList);
    } catch (err) {
      console.error('Error fetching public clubs list:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load clubs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // Filter clubs by search term
  const filteredClubs = clubs.filter((club) => {
    const term = searchQuery.toLowerCase();
    return (
      club.name?.toLowerCase().includes(term) ||
      club.description?.toLowerCase().includes(term)
    );
  });

  return (
    <PublicLayout>
      <div className="space-y-10">
        
        {/* Header Banner & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-widest">
              <Compass className="w-4 h-4" />
              <span>Campus Organizations</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Explore College Clubs
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Join active campus clubs, connect with passionate peers, and take part in exciting workshops & activities.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs by name..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-rose-300">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 text-rose-400" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={fetchClubs}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold uppercase tracking-wider rounded-xl border border-rose-500/40 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ClubCardSkeleton />
            <ClubCardSkeleton />
            <ClubCardSkeleton />
            <ClubCardSkeleton />
            <ClubCardSkeleton />
            <ClubCardSkeleton />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredClubs.length === 0 && (
          <EmptyState
            icon={Building2}
            title={searchQuery ? "No matching clubs" : "No Clubs Registered"}
            description={
              searchQuery
                ? `No clubs found matching "${searchQuery}". Try a different keyword.`
                : "No student clubs have been registered yet."
            }
            actionLabel={searchQuery ? "Clear Search" : undefined}
            onAction={searchQuery ? () => setSearchQuery('') : undefined}
          />
        )}

        {/* Clubs Grid */}
        {!loading && !error && filteredClubs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => {
                const rawLogoUrl = club.logoUrl || club.logo?.url;
                const logoUrl = getCloudinaryUrl(rawLogoUrl, CLOUDINARY_TRANSFORMS.LOGO);
                const initials = club.name ? club.name.slice(0, 2).toUpperCase() : 'CL';

              return (
                <div
                  key={club.id}
                  onClick={() => navigate(`/clubs/${club.id}`)}
                  className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Header with Logo / Monogram */}
                    <div className="flex items-center gap-4">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={club.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-700/60 shadow-md group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                          {initials}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition truncate">
                          {club.name}
                        </h3>
                        <p className="text-xs text-indigo-400 font-medium tracking-wide">
                          Student Organization
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {club.description || 'No description available for this club.'}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                    {(club.memberCount !== undefined || club.managerCount !== undefined) ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span>{club.memberCount || 0} Members</span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        Active Club
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition">
                      <span>View Club</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default PublicClubsListPage;
