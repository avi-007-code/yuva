import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../api/publicApi';
import PublicLayout from '../../components/public/PublicLayout';
import EventModal from '../../components/public/EventModal';
import GalleryLightbox from '../../components/public/GalleryLightbox';
import EmptyState from '../../components/common/EmptyState';
import { EventCardSkeleton } from '../../components/common/CardSkeleton';
import EventHero from '../../components/EventHero';
import { getCloudinaryUrl, CLOUDINARY_TRANSFORMS } from '../../utils/cloudinary';
import { Calendar, MapPin, Building2, Sparkles, AlertCircle, RefreshCw, ArrowRight, Clock, ExternalLink } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
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

const PublicHomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeGalleryEvent, setActiveGalleryEvent] = useState(null);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await publicApi.getUpcomingEvents();
      const eventList =
        res.data?.events ||
        res.events ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      setEvents(eventList);
    } catch (err) {
      console.error('Error fetching site-wide upcoming events:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load upcoming events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  return (
    <PublicLayout>
      <div className="space-y-12">
        
        {/* Energetic Hero Section */}
        <section className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 p-8 md:p-14 overflow-hidden shadow-2xl">
          {/* Subtle Accent Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Campus Life & Student Clubs</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Discover & Attend <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Campus Events</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
              Stay connected with everything happening on campus. Discover upcoming club workshops, tech hackathons, cultural festivals, and sports tournaments.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Browse All Clubs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Upcoming Event Hero Banner (if available) */}
        {!loading && events.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Featured Spotlight Event</span>
            </div>
            <EventHero event={events[0]} />
          </section>
        )}

        {/* Upcoming Events Section Header */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2.5 text-indigo-400 font-semibold text-xs uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                <span>Live Schedule</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                Upcoming Site-Wide Events
              </h2>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              {!loading && !error && `${events.length} event${events.length === 1 ? '' : 's'} scheduled`}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-rose-300">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 shrink-0 text-rose-400" />
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={fetchUpcomingEvents}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold uppercase tracking-wider rounded-xl border border-rose-500/40 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Loading Skeleton Grid */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && events.length === 0 && (
            <EmptyState
              icon={Calendar}
              title="No Upcoming Events Right Now"
              description="There are currently no site-wide upcoming or ongoing events. Explore our clubs directory to see what they're planning!"
              actionLabel="Explore Clubs"
              onAction={() => window.location.href = '/clubs'}
            />
          )}

          {/* Event Cards Grid */}
          {!loading && !error && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const rawCoverUrl = event.coverImage?.url || event.coverImageUrl || event.coverUrl;
                const coverUrl = getCloudinaryUrl(rawCoverUrl, CLOUDINARY_TRANSFORMS.COVER);
                const redirectUrl = event.registrationUrl || event.url || event.externalUrl || event.link;
                const clubName = event.club?.name || 'Student Club';
                const clubId = event.club?.id || event.clubId;

                return (
                  <div
                    key={event.id}
                    className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Event Cover Image or Fallback */}
                    <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900 flex items-center justify-center p-4">
                          <div className="text-center space-y-1">
                            <Sparkles className="w-8 h-8 text-indigo-400/80 mx-auto" />
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              {clubName}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Status Tag */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border backdrop-blur-md shadow-md ${
                            event.status === 'ONGOING'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          }`}
                        >
                          {event.status || 'UPCOMING'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Club Link Badge */}
                        {clubId && (
                          <div onClick={(e) => e.stopPropagation()}>
                            <Link
                              to={`/clubs/${clubId}`}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 rounded-lg border border-indigo-500/20 transition"
                            >
                              <Building2 className="w-3.5 h-3.5" />
                              <span>{clubName}</span>
                            </Link>
                          </div>
                        )}

                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                          {event.title}
                        </h3>

                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* Date & Location Footer */}
                      <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs font-medium text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>{formatDate(event.startAt)} • {formatTime(event.startAt)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}

                        {redirectUrl && (
                          <div onClick={(e) => e.stopPropagation()} className="pt-1">
                            <a
                              href={redirectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider rounded-xl transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Register Link</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onOpenGallery={(evt) => setActiveGalleryEvent(evt)}
        />
      )}

      {/* Photo Gallery Lightbox */}
      {activeGalleryEvent && (
        <GalleryLightbox
          event={activeGalleryEvent}
          onClose={() => setActiveGalleryEvent(null)}
        />
      )}
    </PublicLayout>
  );
};

export default PublicHomePage;
