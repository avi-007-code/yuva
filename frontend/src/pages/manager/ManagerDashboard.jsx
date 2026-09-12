import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managerApi } from '../../api/managerApi';
import { Building2, Users, Sparkles, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import EmptyState from '../../components/common/EmptyState';
import { ClubCardSkeleton } from '../../components/common/CardSkeleton';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalMembers, setTotalMembers] = useState(0);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await managerApi.getMyClubs();
      const clubList =
        res.data?.clubs ||
        res.clubs ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);

      // Fetch detailed club dashboards in parallel to get accurate member counts
      const detailedClubs = await Promise.all(
        clubList.map(async (c) => {
          try {
            const detailRes = await managerApi.getClubDashboard(c.id);
            return detailRes.data?.club || detailRes.data || detailRes || c;
          } catch {
            return c;
          }
        })
      );

      setClubs(detailedClubs);

      let memberCount = 0;
      for (const c of detailedClubs) {
        if (c.members && Array.isArray(c.members)) {
          memberCount += c.members.length;
        }
      }
      setTotalMembers(memberCount);
    } catch (err) {
      if (err.response?.status === 403) {
        setClubs([]);
      } else {
        setError(err.response?.data?.message || 'Failed to load manager dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const storedUser = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('managerUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const managerName = user?.name || storedUser?.name || (user?.email ? user.email.split('@')[0] : 'Manager');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Club Manager Dashboard</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {managerName}!
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage your assigned clubs, update club information, and organize your club activities all in one place.
          </p>
        </div>

        {/* Subtle Decorative Accents */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Real Statistics derived strictly from backend responses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          title="Managed Clubs"
          value={clubs.length}
          subtitle="Clubs you have manager access to"
          icon={Building2}
          gradient="from-purple-500/20 to-indigo-600/20"
        />
        <StatCard
          title="Total Club Members"
          value={totalMembers > 0 ? totalMembers : '—'}
          subtitle="Enrolled members across your clubs"
          icon={Users}
          gradient="from-indigo-500/20 to-blue-600/20"
        />
      </div>

      {/* Managed Clubs Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">My Managed Clubs</h2>
            <p className="text-xs text-slate-400">Select a club below to view details and edit information.</p>
          </div>
          {clubs.length > 0 && (
            <button
              onClick={() => navigate('/manager/clubs')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-300 text-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold uppercase rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
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
            description="You are not currently assigned to manage any clubs. Please contact an administrator to get access."
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
                    {/* Club Logo & Name */}
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
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition truncate">
                          {club.name}
                        </h3>
                        <span className="text-[11px] text-purple-400 font-semibold bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                          Manager Access
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {club.description || 'No description provided for this club.'}
                    </p>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Manage details</span>
                    <div className="flex items-center gap-1 font-bold text-purple-400 group-hover:text-purple-300 transition">
                      <span>Open Club</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
