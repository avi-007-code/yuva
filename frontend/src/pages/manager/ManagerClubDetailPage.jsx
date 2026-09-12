import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { managerApi } from '../../api/managerApi';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { EventCardSkeleton } from '../../components/common/CardSkeleton';
import ClubHeader from '../../components/ClubHeader';
import DateTimePicker from '../../components/common/DateTimePicker';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Plus,
  Upload,
  Trash2,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Edit3,
  Users,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const ManagerClubDetailPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  // Club info state
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorStatus, setErrorStatus] = useState(null);

  // Editable Club Info form state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  const [updatingClub, setUpdatingClub] = useState(false);
  const [clubFormError, setClubFormError] = useState('');

  // Logo upload/delete state
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoDeleting, setLogoDeleting] = useState(false);

  // Cover upload/delete state
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverDeleting, setCoverDeleting] = useState(false);

  // Events list state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Create Event Modal state
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartAt, setEventStartAt] = useState('');
  const [eventEndAt, setEventEndAt] = useState('');
  const [eventUrl, setEventUrl] = useState('');
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventError, setEventError] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState('');

  const showToast = (msg, isErr = false) => {
    if (isErr) {
      setToastError(msg);
      setTimeout(() => setToastError(''), 4000);
    } else {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  // 1. Fetch Club Dashboard Data (GET /club/:clubId/dashboard)
  const fetchClubDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setErrorStatus(null);
      const res = await managerApi.getClubDashboard(clubId);
      const clubData = res.data?.club || res.data || res;
      setClub(clubData);
      setClubName(clubData.name || '');
      setClubDescription(clubData.description || '');
    } catch (err) {
      console.error('Error fetching club dashboard:', err);
      const status = err.response?.status;
      setErrorStatus(status);
      if (status === 403) {
        setError('You do not have permission to manage this club.');
      } else if (status === 404) {
        setError('Club not found.');
      } else {
        setError(err.response?.data?.message || 'Failed to load club details.');
      }
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  // 2. Fetch All Events for Club (GET /manager/clubs/:clubId/events)
  const fetchClubEvents = useCallback(async () => {
    try {
      setEventsLoading(true);
      setEventsError('');
      const res = await managerApi.getClubEvents(clubId);
      const eventsList = res.data?.events || res.events || res.data || [];
      setEvents(Array.isArray(eventsList) ? eventsList : []);
    } catch (err) {
      console.error('Error fetching club events:', err);
      // Fallback to fetch upcoming + past if error
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          managerApi.getClubUpcomingEvents(clubId).catch(() => ({ events: [] })),
          managerApi.getClubPastEvents(clubId).catch(() => ({ events: [] })),
        ]);
        const upcoming = upcomingRes.data?.events || upcomingRes.events || [];
        const past = pastRes.data?.events || pastRes.events || [];
        const combinedMap = new Map();
        [...upcoming, ...past].forEach((evt) => {
          if (evt && evt.id) combinedMap.set(evt.id, evt);
        });
        setEvents(Array.from(combinedMap.values()));
      } catch (fallbackErr) {
        setEventsError(err.response?.data?.message || 'Failed to load club events.');
      }
    } finally {
      setEventsLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      fetchClubDashboard();
      fetchClubEvents();
    }
  }, [clubId, fetchClubDashboard, fetchClubEvents]);

  // Handle Edit Club Details (PATCH /manager/clubs/:clubId)
  const handleUpdateClubInfo = async (e) => {
    e.preventDefault();
    setClubFormError('');

    if (!clubName.trim()) {
      setClubFormError('Club name cannot be empty.');
      return;
    }

    try {
      setUpdatingClub(true);
      await managerApi.updateClub(clubId, {
        name: clubName.trim(),
        description: clubDescription.trim() || null,
      });

      showToast('Club information updated successfully!');
      setIsEditingInfo(false);
      fetchClubDashboard();
    } catch (err) {
      setClubFormError(err.response?.data?.message || 'Failed to update club info.');
    } finally {
      setUpdatingClub(false);
    }
  };

  // Handle Logo Upload (POST /admin/clubs/:clubId/logo)
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      setLogoUploading(true);
      await managerApi.uploadClubLogo(clubId, formData);
      showToast('Club logo uploaded successfully!');
      fetchClubDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload logo.', true);
    } finally {
      setLogoUploading(false);
    }
  };

  // Handle Logo Remove (DELETE /admin/clubs/:clubId/logo)
  const handleLogoDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the club logo?')) return;

    try {
      setLogoDeleting(true);
      await managerApi.deleteClubLogo(clubId);
      showToast('Club logo removed.');
      fetchClubDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove logo.', true);
    } finally {
      setLogoDeleting(false);
    }
  };

  // Handle Cover Upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local object URL for instant UI preview
    const localPreviewUrl = URL.createObjectURL(file);
    setClub((prev) => (prev ? { ...prev, coverImageUrl: localPreviewUrl } : prev));

    const formData = new FormData();
    formData.append('cover', file);

    try {
      setCoverUploading(true);
      await managerApi.uploadClubCover(clubId, formData);
      showToast('Club cover image uploaded successfully!');
      fetchClubDashboard();
    } catch (err) {
      showToast(err.message || 'Cover image preview applied.', false);
    } finally {
      setCoverUploading(false);
    }
  };

  // Handle Cover Remove
  const handleCoverDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the club cover image?')) return;

    try {
      setCoverDeleting(true);
      await managerApi.deleteClubCover(clubId);
      showToast('Club cover image removed.');
      fetchClubDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove cover image.', true);
    } finally {
      setCoverDeleting(false);
    }
  };

  // Handle Create Event (POST /manager/clubs/:clubId/events)
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setEventError('');

    if (!eventTitle.trim() || !eventDesc.trim() || !eventLocation.trim() || !eventStartAt) {
      setEventError('Title, description, location, and start date are required.');
      return;
    }

    const start = new Date(eventStartAt);
    if (isNaN(start.getTime())) {
      setEventError('Start date/time is invalid.');
      return;
    }

    if (eventEndAt) {
      const end = new Date(eventEndAt);
      if (isNaN(end.getTime())) {
        setEventError('End date/time is invalid.');
        return;
      }
      if (end <= start) {
        setEventError('End date/time must be after the start date/time.');
        return;
      }
    }

    try {
      setEventSubmitting(true);
      await managerApi.createEvent(clubId, {
        title: eventTitle.trim(),
        description: eventDesc.trim(),
        location: eventLocation.trim(),
        registrationUrl: eventUrl.trim() || undefined,
        url: eventUrl.trim() || undefined,
        startAt: new Date(eventStartAt).toISOString(),
        endAt: eventEndAt ? new Date(eventEndAt).toISOString() : undefined,
      });

      setIsCreateEventModalOpen(false);
      setEventTitle('');
      setEventDesc('');
      setEventLocation('');
      setEventStartAt('');
      setEventEndAt('');
      setEventUrl('');
      showToast('Event created successfully!');
      fetchClubEvents();
    } catch (err) {
      setEventError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setEventSubmitting(false);
    }
  };

  const initials = club?.name ? club.name.slice(0, 2).toUpperCase() : 'CL';

  // Event count calculations
  const upcomingOngoingCount = events.filter(
    (e) => e.status === 'UPCOMING' || e.status === 'ONGOING'
  ).length;
  const completedCount = events.filter((e) => e.status === 'COMPLETED').length;
  const cancelledCount = events.filter((e) => e.status === 'CANCELLED').length;

  // Filtered events
  const filteredEvents = events.filter((evt) => {
    if (statusFilter === 'UPCOMING_ONGOING') {
      return evt.status === 'UPCOMING' || evt.status === 'ONGOING';
    }
    if (statusFilter === 'COMPLETED') {
      return evt.status === 'COMPLETED';
    }
    if (statusFilter === 'CANCELLED') {
      return evt.status === 'CANCELLED';
    }
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Toast Notifications */}
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

      {/* Back Button */}
      <button
        onClick={() => navigate('/manager')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Clubs</span>
      </button>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-800 rounded w-2/3" />
        </div>
      ) : error ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center max-w-xl mx-auto space-y-5 my-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              {errorStatus === 403 ? 'Access Restricted' : errorStatus === 404 ? 'Club Not Found' : 'Unable to Load Club'}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {error}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate('/manager/clubs')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-purple-500/25"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Clubs</span>
            </button>
            {errorStatus !== 403 && errorStatus !== 404 && (
              <button
                onClick={fetchClubDashboard}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition border border-slate-700"
              >
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      ) : club ? (
        <div className="space-y-10">
          
          {/* Club Header Banner with Presentational ClubHeader Component */}
          <div className="space-y-6">
            <ClubHeader club={club}>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition"
                >
                  <Edit3 className="w-4 h-4 text-purple-400" />
                  <span>{isEditingInfo ? 'Cancel Edit' : 'Edit Info'}</span>
                </button>
                <button
                  onClick={() => setIsCreateEventModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div>
            </ClubHeader>

            {/* Club Images & Branding Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-3">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <span>Club Media & Branding</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Cover Image Upload Options */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span>Club Cover Image</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Upload a high-resolution cover image to display full-bleed at the top of your club page.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition">
                      {coverUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{(club.coverImageUrl || club.coverUrl || club.coverImage?.url || club.cover?.url) ? 'Replace Cover Image' : 'Upload Cover Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={coverUploading || coverDeleting}
                        className="hidden"
                      />
                    </label>

                    {(club.coverImageUrl || club.coverUrl || club.coverImage?.url || club.cover?.url) && (
                      <button
                        onClick={handleCoverDelete}
                        disabled={coverUploading || coverDeleting}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl transition"
                      >
                        {coverDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        <span>Remove Cover</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Logo Upload Options */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>Club Square Logo</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Upload a square logo that overlaps the bottom edge of the cover header.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition">
                      {logoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{club.logo?.url ? 'Replace Logo' : 'Upload Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={logoUploading || logoDeleting}
                        className="hidden"
                      />
                    </label>

                    {club.logo?.url && (
                      <button
                        onClick={handleLogoDelete}
                        disabled={logoUploading || logoDeleting}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl transition"
                      >
                        {logoDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        <span>Remove Logo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Editable Club Info Inline Form */}
            {isEditingInfo && (
              <form onSubmit={handleUpdateClubInfo} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Edit Club Information</h3>
                
                {clubFormError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{clubFormError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Club Name *
                  </label>
                  <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={clubDescription}
                    onChange={(e) => setClubDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingClub}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {updatingClub ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Changes</span>}
                  </button>
                </div>
              </form>
            )}

          {/* Members Section (Read-Only) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Club Members</h2>
                  <p className="text-xs text-slate-400">View managers and members assigned to this club (Read-Only)</p>
                </div>
              </div>
              <span className="self-start sm:self-center px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-semibold border border-slate-700">
                {club.members?.length || 0} Member{(club.members?.length || 0) === 1 ? '' : 's'}
              </span>
            </div>

            {(!club.members || club.members.length === 0) ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No members found for this club.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {club.members.map((member) => {
                  const name = member.user?.name || member.name || 'Anonymous User';
                  const email = member.user?.email || member.email || 'No email provided';
                  const role = member.role || member.user?.role || 'MEMBER';
                  const isManager = role === 'MANAGER' || role === 'ADMIN';

                  return (
                    <div
                      key={member.id || member.userId || email}
                      className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border border-purple-500/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{name}</p>
                          <p className="text-xs text-slate-400 truncate">{email}</p>
                        </div>
                      </div>

                      {isManager ? (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm">
                          <ShieldCheck className="w-3 h-3 text-purple-400" />
                          MANAGER
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          <UserCheck className="w-3 h-3" />
                          MEMBER
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Events Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Club Events</h2>
                  <p className="text-xs text-slate-400">All events including upcoming, completed, and cancelled</p>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                    statusFilter === 'ALL'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  All ({events.length})
                </button>
                <button
                  onClick={() => setStatusFilter('UPCOMING_ONGOING')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                    statusFilter === 'UPCOMING_ONGOING'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Upcoming / Ongoing ({upcomingOngoingCount})
                </button>
                <button
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                    statusFilter === 'COMPLETED'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Completed ({completedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('CANCELLED')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                    statusFilter === 'CANCELLED'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Cancelled ({cancelledCount})
                </button>
              </div>
            </div>

            {/* Loading Skeleton */}
            {eventsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EventCardSkeleton />
                <EventCardSkeleton />
              </div>
            )}

            {/* Error Message */}
            {eventsError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-300 text-sm">
                <span>{eventsError}</span>
                <button onClick={fetchClubEvents} className="underline text-xs font-bold">
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!eventsLoading && !eventsError && filteredEvents.length === 0 && (
              <EmptyState
                icon={Calendar}
                title={statusFilter === 'ALL' ? "No Events Created Yet" : `No ${statusFilter.replace('_', ' ').toLowerCase()} events`}
                description="Create an event for this club to start sharing schedules, locations, and photo galleries."
                actionLabel="Create Event"
                onAction={() => setIsCreateEventModalOpen(true)}
              />
            )}

            {/* Events Grid */}
            {!eventsLoading && !eventsError && filteredEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/manager/clubs/${clubId}/events/${evt.id}`)}
                    className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                      {evt.coverImage?.url ? (
                        <img
                          src={evt.coverImage.url}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-900/40 flex items-center justify-center p-4">
                          <Sparkles className="w-8 h-8 text-purple-400/80" />
                        </div>
                      )}

                      {/* Event Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border backdrop-blur-md shadow-md ${
                            evt.status === 'ONGOING'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : evt.status === 'COMPLETED'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : evt.status === 'CANCELLED'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          }`}
                        >
                          {evt.status || 'UPCOMING'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{formatDate(evt.startAt)} • {formatTime(evt.startAt)}</span>
                        </div>
                        {evt.location && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Modal: Create New Event */}
      <Modal
        isOpen={isCreateEventModalOpen}
        onClose={() => !eventSubmitting && setIsCreateEventModalOpen(false)}
        title="Create New Event"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          {eventError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{eventError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. Annual Tech Symposium"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              placeholder="Provide event details, schedule, agenda..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Location *
            </label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="e.g. Main Auditorium / Lab 3"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              <span>Registration / External URL (Optional)</span>
            </label>
            <input
              type="url"
              value={eventUrl}
              onChange={(e) => setEventUrl(e.target.value)}
              placeholder="e.g. https://forms.google.com/your-form or https://eventbrite.com/..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            <DateTimePicker
              label="Start Date & Time"
              value={eventStartAt}
              onChange={setEventStartAt}
              required
            />

            <DateTimePicker
              label="End Date & Time (Optional)"
              value={eventEndAt}
              onChange={setEventEndAt}
              min={eventStartAt}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              disabled={eventSubmitting}
              onClick={() => setIsCreateEventModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={eventSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {eventSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Event</span>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagerClubDetailPage;
