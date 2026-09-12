import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicApi } from '../../api/publicApi';
import ClubHeader from '../../components/ClubHeader';
import PublicLayout from '../../components/public/PublicLayout';
import EventModal from '../../components/public/EventModal';
import GalleryLightbox from '../../components/public/GalleryLightbox';
import EmptyState from '../../components/common/EmptyState';
import { EventCardSkeleton } from '../../components/common/CardSkeleton';
import { getCloudinaryUrl, CLOUDINARY_TRANSFORMS } from '../../utils/cloudinary';
import {
  ArrowLeft,
  Building2,
  Calendar,
  History,
  MapPin,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Clock,
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

const PublicClubDetailPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  // State for Club Header
  const [club, setClub] = useState(null);
  const [clubLoading, setClubLoading] = useState(true);
  const [clubError, setClubError] = useState(null);

  // State for Upcoming Events section
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState(null);

  // State for Past Events section
  const [pastEvents, setPastEvents] = useState([]);
  const [pastLoading, setPastLoading] = useState(true);
  const [pastError, setPastError] = useState(null);

  // Modal / Lightbox State
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [activeGalleryEvent, setActiveGalleryEvent] = useState(null);

  // 1. Fetch Club Information
  const fetchClubInfo = async () => {
    try {
      setClubLoading(true);
      setClubError(null);
      const res = await publicApi.getClubById(clubId);
      const clubData = res.data?.club || res.club || (res.id ? res : null);
      if (clubData) {
        setClub(clubData);
      } else {
        setClubError('Club details not found.');
      }
    } catch (err) {
      console.error('Error loading club:', err);
      setClubError(err.response?.data?.message || err.message || 'Failed to load club details.');
    } finally {
      setClubLoading(false);
    }
  };

  // 2. Fetch Upcoming Events
  const fetchUpcomingEvents = async () => {
    try {
      setUpcomingLoading(true);
      setUpcomingError(null);
      const res = await publicApi.getClubUpcomingEvents(clubId);
      const eventList =
        res.data?.events ||
        res.events ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      setUpcomingEvents(eventList);
    } catch (err) {
      console.error('Error loading upcoming events:', err);
      setUpcomingError(err.response?.data?.message || err.message || 'Failed to load upcoming events.');
    } finally {
      setUpcomingLoading(false);
    }
  };

  // 3. Fetch Past Events
  const fetchPastEvents = async () => {
    try {
      setPastLoading(true);
      setPastError(null);
      const res = await publicApi.getClubPastEvents(clubId);
      const eventList =
        res.data?.events ||
        res.events ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      setPastEvents(eventList);
    } catch (err) {
      console.error('Error loading past events:', err);
      setPastError(err.response?.data?.message || err.message || 'Failed to load past events.');
    } finally {
      setPastLoading(false);
    }
  };

  useEffect(() => {
    if (clubId) {
      fetchClubInfo();
      fetchUpcomingEvents();
      fetchPastEvents();
    }
  }, [clubId]);

  const initials = club?.name ? club.name.slice(0, 2).toUpperCase() : 'CL';

  return (
    <PublicLayout>
      <div className="space-y-12">
        
        {/* Back Link */}
        <div>
          <button
            onClick={() => navigate('/clubs')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Clubs</span>
          </button>
        </div>

        {/* Club Header Section */}
        {clubLoading ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 animate-pulse space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="h-8 bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-800 rounded w-full max-w-lg" />
              </div>
            </div>
          </div>
        ) : clubError ? (
          <div className="p-8 bg-rose-500/10 border border-rose-500/30 rounded-3xl text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Club Not Found</h2>
            <p className="text-sm text-rose-300">{clubError}</p>
            <button
              onClick={fetchClubInfo}
              className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              Retry
            </button>
          </div>
        ) : club ? (
          <ClubHeader club={club} />
        ) : null}

        {/* SECTION A: Upcoming Events */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Upcoming Events</h2>
                <p className="text-xs text-slate-400">Scheduled events for {club?.name || 'this club'}</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {!upcomingLoading && !upcomingError && `${upcomingEvents.length} event${upcomingEvents.length === 1 ? '' : 's'}`}
            </span>
          </div>

          {/* Error */}
          {upcomingError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-300 text-sm">
              <span>{upcomingError}</span>
              <button
                onClick={fetchUpcomingEvents}
                className="px-3 py-1 bg-rose-500/20 rounded-lg text-xs font-bold uppercase transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {upcomingLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          )}

          {/* Empty */}
          {!upcomingLoading && !upcomingError && upcomingEvents.length === 0 && (
            <EmptyState
              icon={Calendar}
              title="No Upcoming Events"
              description={`There are currently no upcoming events scheduled for ${club?.name || 'this club'}.`}
            />
          )}

          {/* Upcoming Events Grid */}
          {!upcomingLoading && !upcomingError && upcomingEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((evt) => {
                const rawCoverUrl = evt.coverImage?.url || evt.coverImageUrl || evt.coverUrl;
                const coverUrl = getCloudinaryUrl(rawCoverUrl, CLOUDINARY_TRANSFORMS.COVER);
                const redirectUrl = evt.registrationUrl || evt.url || evt.externalUrl || evt.link;

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventModal(evt)}
                    className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900 flex items-center justify-center p-4">
                          <Sparkles className="w-8 h-8 text-indigo-400/80" />
                        </div>
                      )}

                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 backdrop-blur-md">
                          {evt.status || 'UPCOMING'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{formatDate(evt.startAt)} • {formatTime(evt.startAt)}</span>
                        </div>
                        {evt.location && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="truncate">{evt.location}</span>
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
        </section>

        {/* SECTION B: Past Events & Photo Gallery */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Past Events & Photo Gallery</h2>
                <p className="text-xs text-slate-400">Click any past event to view its photo gallery</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {!pastLoading && !pastError && `${pastEvents.length} event${pastEvents.length === 1 ? '' : 's'}`}
            </span>
          </div>

          {/* Error */}
          {pastError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-300 text-sm">
              <span>{pastError}</span>
              <button
                onClick={fetchPastEvents}
                className="px-3 py-1 bg-rose-500/20 rounded-lg text-xs font-bold uppercase transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {pastLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          )}

          {/* Empty */}
          {!pastLoading && !pastError && pastEvents.length === 0 && (
            <EmptyState
              icon={History}
              title="No Past Events"
              description={`No completed past events have been archived for ${club?.name || 'this club'} yet.`}
            />
          )}

          {/* Past Events Grid */}
          {!pastLoading && !pastError && pastEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((evt) => {
                const rawCoverUrl = evt.coverImage?.url || evt.coverImageUrl || evt.coverUrl;
                const coverUrl = getCloudinaryUrl(rawCoverUrl, CLOUDINARY_TRANSFORMS.COVER);
                const galleryCount = Array.isArray(evt.gallery) ? evt.gallery.length : 0;

                return (
                  <div
                    key={evt.id}
                    onClick={() => setActiveGalleryEvent(evt)}
                    className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-900/40 flex items-center justify-center p-4">
                          <ImageIcon className="w-8 h-8 text-purple-400/80" />
                        </div>
                      )}

                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 backdrop-blur-md">
                          COMPLETED
                        </span>
                      </div>

                      {galleryCount > 0 && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/60 text-[11px] font-bold text-white flex items-center gap-1.5 backdrop-blur-md">
                          <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                          <span>{galleryCount} Photos</span>
                        </div>
                      )}
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

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{formatDate(evt.startAt)}</span>
                        </div>
                        <span className="text-purple-400 font-bold group-hover:underline">
                          View Gallery →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Event Details Modal */}
      {selectedEventModal && (
        <EventModal
          event={selectedEventModal}
          club={club}
          onClose={() => setSelectedEventModal(null)}
          onOpenGallery={(evt) => setActiveGalleryEvent(evt)}
        />
      )}

      {/* Lightbox Photo Gallery */}
      {activeGalleryEvent && (
        <GalleryLightbox
          event={activeGalleryEvent}
          onClose={() => setActiveGalleryEvent(null)}
        />
      )}
    </PublicLayout>
  );
};

export default PublicClubDetailPage;
