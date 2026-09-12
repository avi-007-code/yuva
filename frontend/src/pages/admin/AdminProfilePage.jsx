import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Shield,
  Key,
  Save,
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  Lock,
  Sparkles,
  Camera,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import adminApi from '../../api/adminApi';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import StatCard from '../../components/admin/StatCard';
import { useAuth } from '../../context/AuthContext';

const AdminProfilePage = () => {
  const { user: authUser, token, login } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarDeleting, setAvatarDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getProfile();
      const data = res.data || {};
      setProfile(data);
      setName(data.name || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await adminApi.updateProfile({ name: name.trim() });
      showSuccess('Profile name updated successfully!');
      if (res.data?.name) {
        setProfile((prev) => ({ ...prev, name: res.data.name }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile name.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await adminApi.updateProfile({ currentPassword, newPassword });
      showSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const syncAuthUser = (updatedUser) => {
    if (token) {
      login(token, { ...authUser, ...updatedUser });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);
    setError('');
    setAvatarUploading(true);

    try {
      const res = await adminApi.uploadAvatar(formData);
      const updatedUser = res.data || {};
      setProfile((prev) => ({ ...prev, avatar: updatedUser.avatar }));
      syncAuthUser(updatedUser);
      showSuccess('Profile picture updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture.');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;

    setError('');
    setAvatarDeleting(true);
    try {
      const res = await adminApi.deleteAvatar();
      const updatedUser = res.data || {};
      setProfile((prev) => ({ ...prev, avatar: null }));
      syncAuthUser(updatedUser);
      showSuccess('Profile picture removed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove profile picture.');
    } finally {
      setAvatarDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading Admin Profile..." />;
  }

  const avatarUrl = profile?.avatar?.url;
  const initials = (profile?.name || authUser?.name || 'A').slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-8 max-w-5xl mx-auto font-sans"
    >
      {/* Header Banner */}
      <div className="bg-white border border-[#E7E5E4] p-6 sm:p-8 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={profile?.name || 'Admin'} className="w-14 h-14 rounded object-cover border border-[#E7E5E4]" />
            ) : (
              <div className="w-14 h-14 rounded bg-[#FAF9F7] border border-[#E7E5E4] flex items-center justify-center text-[#B08D57] font-serif text-2xl font-normal">
                {initials}
              </div>
            )}
            {avatarUploading && (
              <div className="absolute inset-0 rounded bg-white/80 flex items-center justify-center">
                <span className="w-4 h-4 border-2 border-[#B08D57]/30 border-t-[#B08D57] rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1B1F] tracking-tight">{profile?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0EFEF] border border-[#D8D7DC] text-[#4A4950]">
                System Administrator
              </span>
            </div>
            <p className="text-xs text-[#6B6966] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#8E8B85]" /> {profile?.email}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B08D57] hover:bg-[#997847] text-white text-xs font-medium rounded cursor-pointer transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <span>{avatarUrl ? 'Change Picture' : 'Add Picture'}</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={avatarUploading} className="hidden" />
              </label>
              {avatarUrl && (
                <button type="button" onClick={handleAvatarDelete} disabled={avatarDeleting} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[#8B3A3A] hover:bg-[#FDF2F2] text-xs font-medium rounded border border-[#F3CECE] transition-colors disabled:opacity-50">
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{avatarDeleting ? 'Removing...' : 'Remove'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs text-[#6B6966] bg-[#FAF9F7] px-3.5 py-1.5 rounded border border-[#E7E5E4]">
          <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
          <span>Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-[#EBF3ED] border border-[#D1E3D7] text-[#2E5A44] rounded text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#FDF2F2] border border-[#F3CECE] text-[#8B3A3A] rounded text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Platform Users"
          value={profile?.stats?.totalUsers || 0}
          icon={Users}
          description="Total registered accounts"
        />
        <StatCard
          title="Active Clubs"
          value={profile?.stats?.totalClubs || 0}
          icon={Building2}
          description="Total registered clubs"
        />
        <StatCard
          title="Clubs Created"
          value={profile?.stats?.createdClubs || 0}
          icon={Sparkles}
          description="Clubs established by you"
        />
      </div>

      {/* Profile Form Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Info Form */}
        <form
          onSubmit={handleUpdateName}
          className="bg-white border border-[#E7E5E4] rounded-lg p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between"
        >
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[#1C1B1F] font-serif flex items-center gap-2 border-b border-[#E7E5E4] pb-3">
              <User className="w-4 h-4 text-[#B08D57]" /> Account Settings
            </h2>

            <div>
              <label className="block text-xs font-medium text-[#6B6966] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8E8B85] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#D8D7DC] focus:border-[#B08D57] rounded text-[#1C1B1F] text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6966] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8E8B85] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF9F7] border border-[#E7E5E4] rounded text-[#8E8B85] text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-[#8E8B85] mt-1">
                Admin email address is read-only for security purposes.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6966] mb-1.5">
                System Role
              </label>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0EFEF] border border-[#D8D7DC] text-[#4A4950]">
                  {profile?.role || 'ADMIN'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E7E5E4] flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-4 py-2 bg-[#B08D57] hover:bg-[#997847] text-white text-xs font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {savingProfile ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Name
            </button>
          </div>
        </form>

        {/* Password Security Form */}
        <form
          onSubmit={handleUpdatePassword}
          className="bg-white border border-[#E7E5E4] rounded-lg p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[#1C1B1F] font-serif flex items-center gap-2 border-b border-[#E7E5E4] pb-3">
              <Lock className="w-4 h-4 text-[#B08D57]" /> Security & Password
            </h2>

            <div>
              <label className="block text-xs font-medium text-[#6B6966] mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-[#8E8B85] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#D8D7DC] focus:border-[#B08D57] rounded text-[#1C1B1F] text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6966] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E8B85] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#D8D7DC] focus:border-[#B08D57] rounded text-[#1C1B1F] text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6966] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E8B85] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#D8D7DC] focus:border-[#B08D57] rounded text-[#1C1B1F] text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E7E5E4] flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-4 py-2 bg-[#B08D57] hover:bg-[#997847] text-white text-xs font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {savingPassword ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminProfilePage;

