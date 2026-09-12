import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Building2, UserCheck, PlusCircle, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import adminApi from '../../api/adminApi';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import InviteManagerModal from '../../components/admin/InviteManagerModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClubs: 0,
    totalManagers: 0,
  });
  const [recentClubs, setRecentClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, clubsRes] = await Promise.all([
        adminApi.getAllUsers().catch(() => ({ data: [] })),
        adminApi.getAllClubs().catch(() => ({ data: [] })),
      ]);

      const users = usersRes.data || [];
      const clubs = clubsRes.data || [];

      const totalUsers = users.length;
      const totalClubs = clubs.length;

      const uniqueManagerIds = new Set();
      const clubManagersResults = await Promise.all(
        clubs.map((club) =>
          adminApi.getClubManagers(club.id).catch(() => ({ data: { managers: [] } }))
        )
      );

      clubManagersResults.forEach((res) => {
        const managers = res.data?.managers || [];
        managers.forEach((m) => {
          const userId = m.user?.id || m.userId;
          if (userId) {
            uniqueManagerIds.add(userId);
          }
        });
      });

      users.forEach((u) => {
        if (!u.isActive && u.role !== 'ADMIN') {
          uniqueManagerIds.add(u.id);
        }
      });

      setStats({
        totalUsers,
        totalClubs,
        totalManagers: uniqueManagerIds.size,
      });

      const sortedClubs = [...clubs]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      setRecentClubs(sortedClubs);
    } catch (err) {
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading Admin Dashboard..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-8 font-sans"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#E7E5E4] p-6 sm:p-8 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal font-serif text-[#1C1B1F] tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6966] mt-1">
            Overview of system users, registered clubs, and manager accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2 bg-[#F2F0EC] hover:bg-[#E7E5E4] text-[#38373A] text-xs font-medium rounded border border-[#E7E5E4] transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#6B6966]" />
            <span>Invite Manager</span>
          </button>
          <Link
            to="/admin/clubs/create"
            className="px-4 py-2 bg-[#B08D57] hover:bg-[#997847] text-white text-xs font-medium rounded transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Club</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#FDF2F2] border border-[#F3CECE] text-[#8B3A3A] rounded text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1 bg-[#F9E2E2] hover:bg-[#F3CECE] rounded text-xs font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered platform accounts"
        />
        <StatCard
          title="Total Clubs"
          value={stats.totalClubs}
          icon={Building2}
          description="Active registered student clubs"
        />
        <StatCard
          title="Managers"
          value={stats.totalManagers}
          icon={UserCheck}
          description="Assigned club managers"
        />
      </div>

      {/* Recent Clubs & Quick Actions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Clubs List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1C1B1F] font-serif">Recent Clubs</h2>
            <Link
              to="/admin/clubs"
              className="text-xs font-medium text-[#B08D57] hover:text-[#997847] flex items-center gap-1 transition-colors"
            >
              <span>View All</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentClubs.length === 0 ? (
            <div className="p-8 bg-white border border-[#E7E5E4] rounded-lg text-center text-xs text-[#6B6966]">
              No clubs created yet.
            </div>
          ) : (
            <div className="bg-white border border-[#E7E5E4] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <table className="w-full text-left text-sm text-[#1C1B1F]">
                <thead className="bg-[#FAF9F7] text-xs font-medium text-[#6B6966] border-b border-[#E7E5E4]">
                  <tr>
                    <th className="px-6 py-3 font-medium">Club Name</th>
                    <th className="px-6 py-3 font-medium">Members</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEF]">
                  {recentClubs.map((club) => {
                    const memberCount = club._count?.members || club.members?.length || 0;
                    return (
                      <tr key={club.id} className="hover:bg-[#FAF9F7]/70 transition-colors">
                        <td className="px-6 py-3.5 font-medium text-[#1C1B1F] flex items-center gap-3">
                          <div className="w-7 h-7 rounded bg-[#FAF9F7] border border-[#E7E5E4] text-[#B08D57] flex items-center justify-center font-serif text-xs font-semibold">
                            {club.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[#1C1B1F]">{club.name}</div>
                            <div className="text-[11px] font-normal text-[#8E8B85] truncate max-w-xs">
                              {club.description || 'No description provided'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-[#6B6966] text-xs">
                          {memberCount} member{memberCount !== 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Link
                            to={`/admin/clubs/${club.id}`}
                            className="inline-flex items-center text-xs font-medium px-3 py-1 bg-[#F2F0EC] hover:bg-[#E7E5E4] text-[#38373A] rounded border border-[#E7E5E4] transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-[#1C1B1F] font-serif">Quick Actions</h2>
          <div className="bg-white border border-[#E7E5E4] p-6 rounded-lg space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <button
              onClick={() => navigate('/admin/clubs/create')}
              className="w-full p-3.5 bg-[#FAF9F7] hover:bg-[#F2F0EC] border border-[#E7E5E4] rounded text-left transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-[#1C1B1F]">
                  Create New Club
                </div>
                <p className="text-[11px] text-[#6B6966] mt-0.5">
                  Establish a new club entity in the system.
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8B85]" />
            </button>

            <button
              onClick={() => setInviteModalOpen(true)}
              className="w-full p-3.5 bg-[#FAF9F7] hover:bg-[#F2F0EC] border border-[#E7E5E4] rounded text-left transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-[#1C1B1F]">
                  Invite Manager
                </div>
                <p className="text-[11px] text-[#6B6966] mt-0.5">
                  Send an email invite link for manager setup.
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8B85]" />
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="w-full p-3.5 bg-[#FAF9F7] hover:bg-[#F2F0EC] border border-[#E7E5E4] rounded text-left transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-[#1C1B1F]">
                  Manage All Users
                </div>
                <p className="text-[11px] text-[#6B6966] mt-0.5">
                  Search, inspect, or remove system accounts.
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#8E8B85]" />
            </button>
          </div>
        </div>
      </div>

      <InviteManagerModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </motion.div>
  );
};

export default AdminDashboard;

