import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Calendar,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  Building2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import adminApi from '../../api/adminApi';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import DeleteOtpModal from '../../components/admin/DeleteOtpModal';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getUser(userId);
      setUser(res.data || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user details.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async () => {
    setResending(true);
    setResendSuccess('');
    setError('');
    try {
      await adminApi.resendInvite(userId);
      setResendSuccess('Invitation email resent successfully!');
      setTimeout(() => setResendSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend invitation email.');
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading user details..." />;
  }

  if (error && !user) {
    return (
      <div className="p-8 text-center space-y-4 font-sans">
        <div className="p-4 bg-[#FDF2F2] border border-[#F3CECE] text-[#8B3A3A] rounded max-w-md mx-auto text-xs">
          {error}
        </div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2F0EC] text-[#38373A] text-xs font-medium rounded border border-[#E7E5E4]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users List
        </Link>
      </div>
    );
  }

  const memberships = user?.memberships || [];
  const managerMemberships = memberships.filter((m) => m.role === 'MANAGER');

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-8 max-w-5xl mx-auto font-sans"
    >
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E7E5E4] pb-5">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/users"
            className="p-2 bg-white border border-[#E7E5E4] hover:bg-[#FAF9F7] text-[#6B6966] hover:text-[#1C1B1F] rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1B1F] tracking-tight">{user?.name}</h1>
              {managerMemberships.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF3ED] border border-[#D1E3D7] text-[#2E5A44]">
                  Club Manager ({managerMemberships.length})
                </span>
              )}
            </div>
            <p className="text-xs text-[#8E8B85]">User ID: {user?.id}</p>
          </div>
        </div>

        <button
          onClick={() => setConfirmDeleteOpen(true)}
          className="px-3.5 py-2 bg-[#FDF2F2] hover:bg-[#F9E2E2] text-[#8B3A3A] border border-[#F3CECE] text-xs font-medium rounded transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Account
        </button>
      </div>

      {resendSuccess && (
        <div className="p-4 bg-[#EBF3ED] border border-[#D1E3D7] text-[#2E5A44] rounded text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{resendSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#FDF2F2] border border-[#F3CECE] text-[#8B3A3A] rounded text-xs">
          {error}
        </div>
      )}

      {/* User Information Card */}
      <div className="bg-white border border-[#E7E5E4] rounded-lg p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-base font-semibold text-[#1C1B1F] font-serif flex items-center gap-2 border-b border-[#E7E5E4] pb-3">
          <User className="w-4 h-4 text-[#B08D57]" /> Account Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="font-medium text-[#6B6966]">Full Name</span>
            <p className="text-sm font-medium text-[#1C1B1F]">{user?.name}</p>
          </div>

          <div className="space-y-1">
            <span className="font-medium text-[#6B6966] flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#8E8B85]" /> Email Address
            </span>
            <p className="text-sm font-medium text-[#1C1B1F]">{user?.email}</p>
          </div>

          <div className="space-y-1">
            <span className="font-medium text-[#6B6966] flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#8E8B85]" /> System Role
            </span>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0EFEF] border border-[#D8D7DC] text-[#4A4950]">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-medium text-[#6B6966]">Status</span>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user?.isActive
                    ? 'bg-[#EBF3ED] text-[#2E5A44] border border-[#D1E3D7]'
                    : 'bg-[#FAF4E8] text-[#8A6421] border border-[#EEDFA8]'
                }`}
              >
                {user?.isActive ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> Active Account
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" /> Invitation Pending
                  </>
                )}
              </span>

              {!user?.isActive && (
                <button
                  onClick={handleResendInvite}
                  disabled={resending}
                  className="px-3 py-1 bg-[#B08D57] hover:bg-[#997847] text-white rounded text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {resending && (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <Send className="w-3 h-3" /> Resend Invite
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <span className="font-medium text-[#6B6966] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#8E8B85]" /> Registration Date
            </span>
            <p className="text-xs font-medium text-[#1C1B1F]">
              {user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Associated Clubs Card */}
      <div className="bg-white border border-[#E7E5E4] rounded-lg p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
          <h2 className="text-base font-semibold text-[#1C1B1F] font-serif flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#B08D57]" /> Associated Clubs ({memberships.length})
          </h2>
          <span className="text-xs text-[#6B6966]">Clubs this user is managing or enrolled in</span>
        </div>

        {memberships.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF9F7] border border-[#E7E5E4] rounded text-[#6B6966] text-xs">
            This user is not currently associated with any clubs.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {memberships.map((m) => {
              const club = m.club || {};
              const isManager = m.role === 'MANAGER';

              return (
                <div
                  key={m.id}
                  className="bg-[#FAF9F7] border border-[#E7E5E4] p-4 rounded space-y-3 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-white border border-[#E7E5E4] text-[#B08D57] flex items-center justify-center font-serif font-semibold text-xs">
                          {club.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <h3 className="font-semibold text-[#1C1B1F] text-xs sm:text-sm">
                          {club.name}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          isManager
                            ? 'bg-[#F0EFEF] text-[#4A4950] border border-[#D8D7DC]'
                            : 'bg-[#F9F8F6] text-[#6B6966] border border-[#E7E5E4]'
                        }`}
                      >
                        {isManager && <UserCheck className="w-3 h-3 text-[#B08D57]" />}
                        {m.role}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B6966] line-clamp-2 leading-relaxed">
                      {club.description || 'No description provided for this club.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E7E5E4] flex items-center justify-between text-xs">
                    <span className="text-[#8E8B85] text-[11px]">
                      Joined: {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <Link
                      to={`/admin/clubs/${club.id}`}
                      className="inline-flex items-center gap-1 font-medium text-[#B08D57] hover:text-[#997847] text-xs transition-colors"
                    >
                      <span>View Club</span> <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two-Step OTP Delete User Modal */}
      <DeleteOtpModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onRequestCode={() => adminApi.requestUserDeletionCode(userId)}
        onConfirmDelete={(code) => adminApi.deleteUser(userId, code)}
        title="Delete User Account"
        itemName={user ? `${user.name} (${user.email})` : ''}
        warningText="This action cannot be undone. All associated memberships will be permanently removed."
        confirmText="Confirm Delete User"
        onSuccess={() => {
          navigate('/admin/users');
        }}
      />
    </motion.div>
  );
};

export default UserDetailsPage;

