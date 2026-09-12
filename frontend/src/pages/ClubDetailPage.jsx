import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { TableRowSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { 
  Building2, 
  Users, 
  UserPlus, 
  UserCheck, 
  ArrowLeft, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Mail, 
  User as UserIcon,
  Search
} from 'lucide-react';

const ClubDetailPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState('');

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isExistingModalOpen, setIsExistingModalOpen] = useState(false);

  // Invite Manager Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState('');

  // Add Existing Manager Form
  const [existingUserId, setExistingUserId] = useState('');
  const [existingSubmitting, setExistingSubmitting] = useState(false);
  const [existingError, setExistingError] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Action Loading for Resend Invite (track userId being resent)
  const [resendingUserId, setResendingUserId] = useState(null);

  const fetchClubDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getClubById(clubId);
      const clubData = res.data || res;
      setClub(clubData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load club details.');
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    fetchClubDetails();
  }, [fetchClubDetails]);

  const showToast = (msg, isErr = false) => {
    if (isErr) {
      setToastError(msg);
      setTimeout(() => setToastError(''), 4000);
    } else {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  // Fetch available users for "Add Existing Manager" dropdown
  const handleOpenExistingModal = async () => {
    setIsExistingModalOpen(true);
    setExistingError('');
    setExistingUserId('');
    setUserSearchTerm('');
    try {
      setLoadingUsers(true);
      const res = await adminApi.getAllUsers();
      const usersList = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
      setAvailableUsers(usersList);
    } catch (err) {
      setExistingError('Failed to fetch user list. You can still paste a User ID.');
    } finally {
      setLoadingUsers(false);
    }
  };

  // 1. Submit Invite New Manager
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteError('');

    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError('Both name and email are required.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
      setInviteError('Please enter a valid email address.');
      return;
    }

    try {
      setInviteSubmitting(true);
      await adminApi.inviteManager(clubId, {
        name: inviteName.trim(),
        email: inviteEmail.trim(),
      });

      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
      showToast('Manager invitation sent successfully!');
      fetchClubDetails();
    } catch (err) {
      setInviteError(err.response?.data?.message || 'Failed to send manager invite.');
    } finally {
      setInviteSubmitting(false);
    }
  };

  // 2. Submit Add Existing Manager
  const handleExistingSubmit = async (e) => {
    e.preventDefault();
    setExistingError('');

    if (!existingUserId.trim()) {
      setExistingError('Please select or enter a valid User ID.');
      return;
    }

    try {
      setExistingSubmitting(true);
      await adminApi.addExistingManager(clubId, existingUserId.trim());

      setIsExistingModalOpen(false);
      setExistingUserId('');
      showToast('Existing user added as club manager successfully!');
      fetchClubDetails();
    } catch (err) {
      setExistingError(err.response?.data?.message || 'Failed to add existing user as manager.');
    } finally {
      setExistingSubmitting(false);
    }
  };

  // 3. Resend Invite Trigger
  const handleResendInvite = async (userId) => {
    if (!userId) {
      showToast('Cannot resend invite: User ID missing.', true);
      return;
    }

    try {
      setResendingUserId(userId);
      await adminApi.resendInvite(userId);
      showToast('Invitation email resent successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to resend invite.', true);
    } finally {
      setResendingUserId(null);
    }
  };

  const membersList = club?.members || [];

  const filteredUsersList = availableUsers.filter((u) => {
    const term = userSearchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.id && u.id.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Messages */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-xl text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {toastError && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-rose-950 border border-rose-500/40 text-rose-300 rounded-xl shadow-xl text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span>{toastError}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <button
        onClick={() => navigate('/admin/clubs')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Clubs Directory</span>
      </button>

      {/* Loading & Error States */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-slate-800 rounded"></div>
          <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-400 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchClubDetails} className="underline text-xs font-semibold hover:text-white">
            Retry
          </button>
        </div>
      ) : club ? (
        <>
          {/* Club Header Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{club.name}</h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      {membersList.length} {membersList.length === 1 ? 'Member' : 'Members'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2 max-w-2xl">
                    {club.description || 'No description available for this club.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => {
                    setInviteError('');
                    setIsInviteModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite New Manager</span>
                </button>

                <button
                  onClick={handleOpenExistingModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 text-sm font-semibold rounded-xl transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Add Existing User</span>
                </button>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Club Roster</h3>
              <span className="text-xs text-slate-400">Total {membersList.length} user(s)</span>
            </div>

            {membersList.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No members or managers found"
                  description="This club currently has no assigned members or managers. Invite a manager to get started."
                  actionText="Invite Manager"
                  onAction={() => setIsInviteModalOpen(true)}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-6">Name</th>
                      <th className="py-3.5 px-6">Email</th>
                      <th className="py-3.5 px-6">Role</th>
                      <th className="py-3.5 px-6">Joined Date</th>
                      <th className="py-3.5 px-6">Activation Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {membersList.map((member, index) => {
                      const user = member.user || {};
                      const isManager = member.role === 'MANAGER';
                      const isPending = user.isActive === false;
                      const userId = user.id;

                      return (
                        <tr key={member.id || index} className="hover:bg-slate-800/30 transition-colors">
                          {/* Name */}
                          <td className="py-4 px-6 font-medium text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span>{user.name || 'Unnamed User'}</span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-4 px-6 text-slate-400">
                            {user.email || 'N/A'}
                          </td>

                          {/* Role */}
                          <td className="py-4 px-6">
                            <Badge variant={isManager ? 'manager' : 'member'}>
                              {member.role || 'MEMBER'}
                            </Badge>
                          </td>

                          {/* Joined Date */}
                          <td className="py-4 px-6 text-slate-400 text-xs">
                            {member.joinedAt
                              ? new Date(member.joinedAt).toLocaleDateString()
                              : 'N/A'}
                          </td>

                          {/* Activation Status */}
                          <td className="py-4 px-6">
                            {isPending ? (
                              <Badge variant="pending">Invite Pending</Badge>
                            ) : (
                              <Badge variant="active">Active</Badge>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            {isPending && isManager && userId && (
                              <button
                                onClick={() => handleResendInvite(userId)}
                                disabled={resendingUserId === userId}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-amber-500/20 text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
                              >
                                {resendingUserId === userId ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Sending...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Resend Invite</span>
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* Modal 1: Invite New Manager */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => !inviteSubmitting && setIsInviteModalOpen(false)}
        title="Invite New Manager"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">
            An email invitation will be automatically dispatched to activate their account and manage this club.
          </p>

          {inviteError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{inviteError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Manager Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Manager Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              disabled={inviteSubmitting}
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              {inviteSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inviting...</span>
                </>
              ) : (
                <span>Send Invitation</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Add Existing User as Manager */}
      <Modal
        isOpen={isExistingModalOpen}
        onClose={() => !existingSubmitting && setIsExistingModalOpen(false)}
        title="Add Existing Active User as Manager"
      >
        <form onSubmit={handleExistingSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">
            Assign manager privileges for this club to an active registered user.
          </p>

          {existingError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{existingError}</span>
            </div>
          )}

          {/* User Select / Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Registered User *
            </label>

            {loadingUsers ? (
              <div className="p-3 text-xs text-slate-400 flex items-center gap-2 bg-slate-950 rounded-xl border border-slate-800">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Loading available users...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Filter user by name or email..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={existingUserId}
                  onChange={(e) => setExistingUserId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                >
                  <option value="">-- Choose a user --</option>
                  {filteredUsersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || 'User'} ({u.email})
                    </option>
                  ))}
                </select>

                <div className="pt-2">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Or manually enter User ID:
                  </label>
                  <input
                    type="text"
                    value={existingUserId}
                    onChange={(e) => setExistingUserId(e.target.value)}
                    placeholder="Enter raw user UUID"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              disabled={existingSubmitting}
              onClick={() => setIsExistingModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={existingSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              {existingSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <span>Add Manager</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClubDetailPage;
