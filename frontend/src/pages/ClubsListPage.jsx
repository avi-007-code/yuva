import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Calendar
} from 'lucide-react';

const ClubsListPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const navigate = useNavigate();

  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getClubs();
      const clubList =
        (Array.isArray(res.data) && res.data) ||
        (Array.isArray(res.data?.clubs) && res.data.clubs) ||
        (Array.isArray(res.clubs) && res.clubs) ||
        (Array.isArray(res) && res) ||
        [];
      setClubs(clubList);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load clubs. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!newClubName.trim()) {
      setModalError('Club name is required.');
      return;
    }

    try {
      setSubmitting(true);
      await adminApi.createClub({
        name: newClubName.trim(),
        description: newClubDesc.trim() || undefined,
      });

      setIsModalOpen(false);
      setNewClubName('');
      setNewClubDesc('');
      showToast('Club created successfully!');
      fetchClubs();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create club. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-xl text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Clubs Directory</h2>
          <p className="text-sm text-slate-400 mt-1">Manage all organization clubs and their respective members.</p>
        </div>

        <button
          onClick={() => {
            setModalError('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Club</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-400 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchClubs} className="underline text-xs font-semibold hover:text-white">
            Retry
          </button>
        </div>
      )}

      {/* Search Filter */}
      {!loading && clubs.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clubs by name or description..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredClubs.length === 0 ? (
        clubs.length === 0 ? (
          <EmptyState
            title="No clubs yet"
            description="Create your first organization club to start inviting managers and members."
            actionText="Create Club"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 text-sm">
            No clubs matched your search query "{searchQuery}".
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => {
            const memberCount = club._count?.members ?? club.members?.length ?? 0;
            return (
              <div
                key={club.id}
                onClick={() => navigate(`/admin/clubs/${club.id}`)}
                className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 shadow-md hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:scale-105 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-xs font-medium text-slate-300">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                    {club.name}
                  </h3>

                  <p className="text-slate-400 text-sm line-clamp-2 mb-6 min-h-[40px]">
                    {club.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Created {new Date(club.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Club Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title="Create New Club"
      >
        <form onSubmit={handleCreateClub} className="space-y-4">
          {modalError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Club Name *
            </label>
            <input
              type="text"
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
              placeholder="e.g. Robotics & AI Club"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={newClubDesc}
              onChange={(e) => setNewClubDesc(e.target.value)}
              placeholder="Brief description of the club's goals and activities..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              disabled={submitting}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Club</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClubsListPage;
