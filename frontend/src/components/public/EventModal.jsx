import React from 'react';
import { X, Calendar, MapPin, Clock, Building2, Tag, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const EventModal = ({ event, club, onClose, onOpenGallery }) => {
  if (!event) return null;

  const coverUrl = event.coverImage?.url;
  const clubInfo = event.club || club;
  const hasGallery = Array.isArray(event.gallery) && event.gallery.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-slate-950/60 hover:bg-slate-950/90 text-slate-400 hover:text-white rounded-full border border-slate-700/50 backdrop-blur-md transition-all shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Image or Fallback Banner */}
        <div className="relative h-64 w-full bg-slate-800 overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-slate-900 flex items-center justify-center p-6 text-center">
              <div className="space-y-2">
                <div className="inline-flex p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/30">
                  <Calendar className="w-8 h-8" />
                </div>
                <p className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                  {clubInfo?.name || 'Club Event'}
                </p>
              </div>
            </div>
          )}

          {/* Status Badge Overlay */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md shadow-md ${
                event.status === 'ONGOING'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : event.status === 'COMPLETED'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : event.status === 'CANCELLED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}
            >
              {event.status || 'UPCOMING'}
            </span>
            {clubInfo?.id && (
              <Link
                to={`/clubs/${clubInfo.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-slate-950/70 text-slate-200 border border-slate-700/60 hover:border-indigo-500 transition-all backdrop-blur-md"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{clubInfo.name}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {event.title}
            </h2>
          </div>

          {/* Date, Time, Location Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-start gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date & Time</p>
                <p className="text-sm font-medium text-white mt-0.5">{formatDate(event.startAt)}</p>
                <p className="text-xs text-indigo-300 font-mono mt-0.5">
                  {formatTime(event.startAt)} {event.endAt ? ` - ${formatTime(event.endAt)}` : ''}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-start gap-3">
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</p>
                <p className="text-sm font-medium text-white mt-0.5">{event.location || 'Campus Center'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">About This Event</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/30 p-4 border border-slate-800/60 rounded-2xl">
              {event.description || 'No description provided.'}
            </p>
          </div>

          {/* Action buttons: Registration / Redirect Link & Gallery */}
          {((event.registrationUrl || event.url || event.externalUrl || event.link) || hasGallery) && (
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
              {(event.registrationUrl || event.url || event.externalUrl || event.link) ? (
                <a
                  href={event.registrationUrl || event.url || event.externalUrl || event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Register / Open Link</span>
                </a>
              ) : <div />}

              {hasGallery && (
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenGallery) onOpenGallery(event);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition"
                >
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span>Gallery ({event.gallery.length})</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
