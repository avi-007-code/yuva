import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { managerApi } from '../../api/managerApi';
import Modal from '../../components/common/Modal';
import EventHero from '../../components/EventHero';
import DateTimePicker from '../../components/common/DateTimePicker';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Upload,
  Trash2,
  Ban,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Image as ImageIcon,
  Sparkles,
  Plus,
  ExternalLink,
} from 'lucide-react';

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  // Format as YYYY-MM-DDTHH:MM for datetime-local input
  const pad = (num) => String(num).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const ManagerEventDetailPage = () => {
  const { clubId, eventId } = useParams();
  const navigate = useNavigate();

  // Event State
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Cover Image State
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverDeleting, setCoverDeleting] = useState(false);

  // Gallery Upload State
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [deletingPublicId, setDeletingPublicId] = useState(null);

  // Confirmation Modals State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // Fetch Event Details
  const fetchEventDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await managerApi.getPublicEvent(clubId, eventId);
      const evt = res.data?.event || res.event || res;
      setEvent(evt);
      setTitle(evt.title || '');
      setDescription(evt.description || '');
      setLocation(evt.location || '');
      setStartAt(formatDateForInput(evt.startAt));
      setEndAt(formatDateForInput(evt.endAt));
      setRegistrationUrl(evt.registrationUrl || evt.url || evt.externalUrl || evt.link || '');
    } catch (err) {
      console.error('Error loading event:', err);
      setError(err.response?.data?.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  }, [clubId, eventId]);

  useEffect(() => {
    if (clubId && eventId) {
      fetchEventDetails();
    }
  }, [clubId, eventId, fetchEventDetails]);

  // Submit Event Edits
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !description.trim() || !location.trim() || !startAt) {
      setFormError('Title, description, location, and start date are required.');
      return;
    }

    const start = new Date(startAt);
    if (isNaN(start.getTime())) {
      setFormError('Start date/time is invalid.');
      return;
    }

    if (endAt) {
      const end = new Date(endAt);
      if (isNaN(end.getTime())) {
        setFormError('End date/time is invalid.');
        return;
      }
      if (end <= start) {
        setFormError('End date/time must be after start date/time.');
        return;
      }
    }

    try {
      setSaving(true);
      await managerApi.updateEvent(clubId, eventId, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        registrationUrl: registrationUrl.trim() || undefined,
        url: registrationUrl.trim() || undefined,
        startAt: new Date(startAt).toISOString(),
        endAt: endAt ? new Date(endAt).toISOString() : null,
      });

      showToast('Event updated successfully!');
      fetchEventDetails();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  // Cancel Event
  const handleCancelEvent = async () => {
    try {
      setCancelling(true);
      await managerApi.cancelEvent(clubId, eventId);
      setIsCancelModalOpen(false);
      showToast('Event has been cancelled.');
      fetchEventDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel event.', true);
    } finally {
      setCancelling(false);
    }
  };

  // Delete Event Permanently
  const handleDeleteEvent = async () => {
    try {
      setDeleting(true);
      await managerApi.deleteEvent(eventId);
      setIsDeleteModalOpen(false);
      showToast('Event deleted permanently.');
      navigate(`/manager/clubs/${clubId}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete event.', true);
    } finally {
      setDeleting(false);
    }
  };

  // Cover Image Upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cover', file);

    try {
      setCoverUploading(true);
      await managerApi.uploadEventCover(eventId, formData);
      showToast('Cover image uploaded!');
      fetchEventDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload cover image.', true);
    } finally {
      setCoverUploading(false);
    }
  };

  // Cover Image Delete
  const handleCoverDelete = async () => {
    if (!window.confirm('Are you sure you want to remove the cover image?')) return;

    try {
      setCoverDeleting(true);
      await managerApi.deleteEventCover(eventId);
      showToast('Cover image removed.');
      fetchEventDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove cover image.', true);
    } finally {
      setCoverDeleting(false);
    }
  };

  // Multi-image Gallery Upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 10) {
      showToast('You can upload a maximum of 10 gallery images at once.', true);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      setGalleryUploading(true);
      await managerApi.uploadEventGallery(eventId, formData);
      showToast('Gallery images uploaded!');
      fetchEventDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload gallery images.', true);
    } finally {
      setGalleryUploading(false);
    }
  };

  // Single Gallery Image Delete
  const handleGalleryImageDelete = async (publicId) => {
    if (!window.confirm('Remove this photo from the event gallery?')) return;

    try {
      setDeletingPublicId(publicId);
      await managerApi.deleteEventGalleryImage(eventId, publicId);
      showToast('Photo removed from gallery.');
      fetchEventDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove photo.', true);
    } finally {
      setDeletingPublicId(null);
    }
  };

  const isCancelledOrCompleted = event?.status === 'CANCELLED' || event?.status === 'COMPLETED';
  const gallery = Array.isArray(event?.gallery) ? event.gallery : [];

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
        onClick={() => navigate(`/manager/clubs/${clubId}`)}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Club Management</span>
      </button>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-800 rounded w-2/3" />
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-300 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={fetchEventDetails} className="underline text-xs font-bold hover:text-white">
            Retry
          </button>
        </div>
      ) : event ? (
        <div className="space-y-8">
          
          {/* Header Banner & Status */}
          {/* Magazine Hero Banner for Event */}
          <EventHero event={event}>
            <div className="flex items-center gap-3 flex-wrap">
              {!isCancelledOrCompleted && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold uppercase tracking-wider rounded-xl backdrop-blur-md transition"
                >
                  <Ban className="w-4 h-4" />
                  <span>Cancel Event</span>
                </button>
              )}

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold uppercase tracking-wider rounded-xl backdrop-blur-md transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Event</span>
              </button>
            </div>
          </EventHero>

          {/* Section 1: Edit Event Details Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>Edit Event Details</span>
            </h2>

            {formError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                  <span>Registration / Redirect URL (Google Forms, etc.)</span>
                </label>
                <input
                  type="url"
                  value={registrationUrl}
                  onChange={(e) => setRegistrationUrl(e.target.value)}
                  placeholder="e.g. https://forms.google.com/your-form or https://eventbrite.com/..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <DateTimePicker
                  label="Start Date & Time"
                  value={startAt}
                  onChange={setStartAt}
                  required
                />

                <DateTimePicker
                  label="End Date & Time (Optional)"
                  value={endAt}
                  onChange={setEndAt}
                  min={startAt}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Cover Image Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              <span>Event Cover Image</span>
            </h2>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative w-full md:w-80 h-44 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                {event.coverImage?.url ? (
                  <img
                    src={event.coverImage.url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 text-center text-slate-500">
                    <div className="space-y-1">
                      <Sparkles className="w-6 h-6 text-purple-400/60 mx-auto" />
                      <p className="text-xs">No cover image uploaded</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload a high-resolution cover image to showcase on the campus event feed.
                </p>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition">
                    {coverUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{event.coverImage?.url ? 'Replace Cover Image' : 'Upload Cover Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={coverUploading || coverDeleting}
                      className="hidden"
                    />
                  </label>

                  {event.coverImage?.url && (
                    <button
                      onClick={handleCoverDelete}
                      disabled={coverUploading || coverDeleting}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl transition"
                    >
                      {coverDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Event Photo Gallery */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                  <span>Photo Gallery</span>
                </h2>
                <p className="text-xs text-slate-400">Upload photos captured during or after the event</p>
              </div>

              {/* Multi-image Upload Button */}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition">
                {galleryUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Add Photos (Up to 10)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={galleryUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Gallery Grid */}
            {gallery.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 border border-slate-800/80 rounded-2xl">
                <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No photos in gallery yet</p>
                <p className="text-xs text-slate-500 mt-1">Upload event photos to allow campus visitors to view the gallery.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gallery.map((img, idx) => (
                  <div key={img.publicId || idx} className="relative group rounded-2xl overflow-hidden border border-slate-800 aspect-square bg-slate-950">
                    <img src={img.url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    
                    {/* Delete Photo Overlay Button */}
                    <button
                      onClick={() => handleGalleryImageDelete(img.publicId)}
                      disabled={deletingPublicId === img.publicId}
                      className="absolute top-2 right-2 p-2 bg-rose-950/80 hover:bg-rose-600 text-white rounded-full border border-rose-500/40 transition opacity-90 group-hover:opacity-100 shadow-lg"
                      title="Delete Photo"
                    >
                      {deletingPublicId === img.publicId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Confirmation Modal: Cancel Event */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => !cancelling && setIsCancelModalOpen(false)}
        title="Cancel Event"
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              Are you sure you want to cancel "{event?.title}"? The event status will change to CANCELLED on public listings.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={cancelling}
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
            >
              No, Keep Event
            </button>
            <button
              type="button"
              disabled={cancelling}
              onClick={handleCancelEvent}
              className="inline-flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Yes, Cancel Event</span>}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal: Delete Event */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        title="Permanently Delete Event"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-rose-200 mb-1">Warning: Permanent Deletion</p>
              <p>
                Deleting "{event?.title}" will permanently remove this event and all associated cover & gallery photos from Cloudinary. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={deleting}
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDeleteEvent}
              className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Delete Permanently</span>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerEventDetailPage;
