import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerApi } from '../../api/managerApi';
import EmptyState from '../../components/common/EmptyState';
import { ClubCardSkeleton } from '../../components/common/CardSkeleton';
import { Building2, Sparkles, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

const MyClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchMyClubs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await managerApi.getMyClubs();
      // Handle data envelope or top-level clubs array
      const clubList =
        res.data?.clubs ||
        res.clubs ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      setClubs(clubList);
    } catch (err) {
      if (err.response?.status === 403) {
        // Backend throws 403 when user has zero MANAGER memberships
        setClubs([]);
      } else {
        setError(err.response?.data?.message || 'Failed to load your assigned clubs.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClubs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Club Manager Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Managed Clubs</h1>
          <p className="text-slate-400 text-sm mt-1">
            Select a club to edit details, upload logo, manage events, and upload photo galleries.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-300 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchMyClubs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold uppercase rounded-xl transition"
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
      {!loading && !error && clubs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const logoUrl = club.logo?.url;
            const initials = club.name ? club.name.slice(0, 2).toUpperCase() : 'CL';

            return (
              <div
                key={club.id}
                onClick={() => navigate(`/manager/clubs/${club.id}`)}
                className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Header Logo */}
                  <div className="flex items-center gap-4">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={club.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-700/60 shadow-md group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                        {initials}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition truncate">
                        {club.name}
                      </h3>
                      <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                        Manager Access
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {club.description || 'No description provided for this club.'}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Click to manage</span>
                  <div className="flex items-center gap-1 font-bold text-purple-400 group-hover:text-purple-300 transition">
                    <span>Manage Club</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
