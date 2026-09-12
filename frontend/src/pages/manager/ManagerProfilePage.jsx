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
  Camera,
  Trash2,
  Lock,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { managerApi } from '../../api/managerApi';
import { useAuth } from '../../context/AuthContext';
import { ClubCardSkeleton } from '../../components/common/CardSkeleton';

const ManagerProfilePage = () => {
  const { user: authUser, login, token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Personal Info Form
  const [name, setName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Avatar State
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarDeleting, setAvatarDeleting] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await managerApi.getProfile();
      const data = res.data || {};
      setProfile(data);
      setName(data.name || '');
    } catch (err) {
      console.error('Error fetching manager profile:', err);
      // Fallback to authUser if endpoint fails
      if (authUser) {
        setProfile(authUser);
        setName(authUser.name || '');
      } else {
        setError(err.response?.data?.message || 'Failed to load profile details.');
      }
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
      const res = await managerApi.updateProfile({ name: name.trim() });
      const updatedUser = res.data || {};
      showSuccess('Profile name updated successfully!');

      setProfile((prev) => ({ ...prev, name: updatedUser.name || name.trim() }));
      // Sync auth context and local storage
      if (token) {
        login(token, { ...authUser, name: updatedUser.name || name.trim() });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile name.');
    } finally {
      setSavingProfile(false);
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
      const res = await managerApi.uploadAvatar(formData);
      const updatedUser = res.data || {};
      showSuccess('Profile picture updated!');
      setProfile((prev) => ({ ...prev, avatar: updatedUser.avatar }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;

    setError('');
    setAvatarDeleting(true);
    try {
      await managerApi.deleteAvatar();
      showSuccess('Profile picture removed.');
      setProfile((prev) => ({ ...prev, avatar: null }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove profile picture.');
    } finally {
      setAvatarDeleting(false);
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
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await managerApi.updateProfile({
        currentPassword,
        newPassword,
      });
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

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <ClubCardSkeleton />
        <ClubCardSkeleton />
      </div>
    );
  }

  const avatarUrl = profile?.avatar?.url;
  const initials = (profile?.name || authUser?.name || 'M')
    .slice(0, 2)
    .toUpperCase();

  const formattedJoinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Container with Hover Upload Overlay */}
          <div className="relative group shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.name || 'Manager'}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-slate-800 shadow-2xl group-hover:opacity-90 transition"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-3xl border-4 border-slate-800 shadow-2xl">
                {initials}
              </div>
            )}

            {/* Upload Label / Overlay */}
            <label className="absolute inset-0 bg-slate-950/60 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer transition-opacity backdrop-blur-xs">
              <Camera className="w-6 h-6 mb-1" />
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={avatarUploading}
                className="hidden"
              />
            </label>

            {avatarUploading && (
              <div className="absolute inset-0 bg-slate-950/80 rounded-3xl flex items-center justify-center text-purple-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
          </div>

          {/* User Info Header */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Manager Settings</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {profile?.name || authUser?.name || 'Manager Profile'}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{profile?.email || authUser?.email}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Club Manager</span>
              </div>
            </div>

            {/* Photo Action Buttons */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition">
                <Camera className="w-4 h-4" />
                <span>Upload New Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                  className="hidden"
                />
              </label>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleAvatarDelete}
                  disabled={avatarDeleting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700/60 text-slate-300 font-semibold text-xs rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Picture</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Banners */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Personal Information</h2>
                <p className="text-xs text-slate-400">Update your account display name</p>
              </div>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={profile?.email || authUser?.email || ''}
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Email address cannot be modified directly. Contact an admin if you need an email change.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-500/25 transition disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Name</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Password & Security Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Security & Password</h2>
                <p className="text-xs text-slate-400">Change your account access password</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-11 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition focus:outline-none"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-11 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Column: Account Summary Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Account Overview
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span>Managed Clubs</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {profile?.managedClubs?.length || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span>Account Role</span>
                </div>
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  Manager
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Joined</span>
                </div>
                <span className="text-xs text-slate-300 font-medium">
                  {formattedJoinedDate}
                </span>
              </div>
            </div>

            {profile?.managedClubs?.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Assigned Clubs
                </h4>
                <div className="space-y-2">
                  {profile.managedClubs.map((club) => (
                    <div
                      key={club.id}
                      className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs font-medium text-slate-200 truncate"
                    >
                      {club.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfilePage;
