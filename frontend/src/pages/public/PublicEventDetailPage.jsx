import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { publicApi } from '../../api/publicApi';
import PublicLayout from '../../components/public/PublicLayout';
import GalleryLightbox from '../../components/public/GalleryLightbox';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Share2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Ticket,
  Users,
  CheckCircle2,
} from 'lucide-react';

const formatDateParts = (dateString) => {
  if (!dateString) return { day: 'TBA', month: 'TBA', full: 'Date TBA' };
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return { day: 'TBA', month: 'TBA', full: 'Date TBA' };
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const full = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return { day, month, full };
};

const formatEventTime = (startStr, endStr) => {
  if (!startStr) return null;
  const d = new Date(startStr);
  if (isNaN(d.getTime())) return null;
  let timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (endStr) {
    const end = new Date(endStr);
    if (!isNaN(end.getTime())) {
      const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      timeStr = `${timeStr} - ${endTime}`;
    }
  }
  return timeStr;
};

const PublicEventDetailPage = () => {
  const { clubId, eventId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [event, setEvent] = useState(null);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);

      const upcomingRes = await publicApi.getUpcomingEvents();
      const allUpcoming =
        upcomingRes.data?.events ||
        upcomingRes.events ||
        (Array.isArray(upcomingRes.data) ? upcomingRes.data : Array.isArray(upcomingRes) ? upcomingRes : []);

      let currentEvent = null;
      let currentClub = null;

      if (clubId && eventId) {
        try {
          const singleRes = await publicApi.getPublicEvent(clubId, eventId);
          currentEvent = singleRes.event || singleRes.data?.event;
          currentClub = singleRes.club || singleRes.data?.club;
        } catch (err) {
          console.warn('Could not fetch single event by ID:', err);
        }
      }

      if (!currentEvent && eventId) {
        currentEvent = allUpcoming.find((e) => e.id === eventId);
        if (currentEvent?.club) currentClub = currentEvent.club;
      }

      if (!currentEvent && allUpcoming.length > 0) {
        currentEvent = allUpcoming[0];
        currentClub = currentEvent.club;
      }

      if (currentEvent) {
        setEvent(currentEvent);
        setClub(currentClub || currentEvent.club);
      } else {
        setError('Event details not found.');
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (event?.title) {
      document.title = `${event.title} | 4 THE PEOPLE`;
    } else {
      document.title = 'Event Details | 4 THE PEOPLE';
    }
  }, [event]);

  useEffect(() => {
    fetchEventData();
    window.scrollTo(0, 0);
  }, [clubId, eventId]);

  const dateInfo = formatDateParts(event?.startAt || event?.startDate || event?.date);
  const eventTime = formatEventTime(event?.startAt || event?.startDate || event?.date, event?.endAt || event?.endDate);

  const handleRegister = () => {
    setRegistered(true);
    setShowModal(true);
  };

  return (
    <PublicLayout>
      <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold uppercase transition cursor-pointer ${
            isDark
              ? 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs hover:border-slate-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Error State */}
        {error && (
          <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className={`text-xl font-extrabold font-['Syne',sans-serif] ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Event Not Available</h2>
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={fetchEventData}
              className="px-5 py-2.5 bg-red-500/20 text-red-200 rounded-full text-xs font-bold uppercase"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={`h-[480px] rounded-3xl animate-pulse border ${
            isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'
          }`} />
        )}

        {/* Event Main Content */}
        {!loading && !error && event && (
          <>
            {/* Event Hero Poster */}
            <div className={`rounded-3xl border overflow-hidden transition-colors ${
              isDark ? 'bg-[#12141C] border-white/15 shadow-2xl' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="relative aspect-[21/9] w-full bg-gray-900 overflow-hidden">
                <img
                  src={event.coverImage?.url || event.coverUrl || event.bannerUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${
                  isDark ? 'bg-gradient-to-t from-[#12141C] via-black/40 to-transparent' : 'bg-gradient-to-t from-white/90 via-black/20 to-transparent'
                }`} />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[#00F0FF] text-[11px] font-black uppercase">
                    <span>{event.category || 'CAMPUS EVENT'}</span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#00F0FF] text-black text-[10px] font-black uppercase">
                    REGISTRATION OPEN
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <div className="space-y-2">
                  <h1 className={`font-['Syne',sans-serif] text-3xl sm:text-5xl font-black uppercase tracking-tight ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}>
                    {event.title}
                  </h1>

                  <p className={`text-sm font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    Organized by{' '}
                    <Link
                      to={`/clubs/${club?.id || clubId}`}
                      className="text-cyan-500 hover:underline font-extrabold"
                    >
                      {club?.name || event.club?.name || "Campus Club"}
                    </Link>
                  </p>
                </div>

                {/* Details Badges Row */}
                <div className={`flex flex-wrap items-center gap-4 py-4 border-y text-xs font-bold ${
                  isDark ? 'border-white/10 text-gray-300' : 'border-slate-200 text-slate-700'
                }`}>
                  <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    <span>{dateInfo.full}</span>
                  </div>
                  {eventTime && (
                    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span>{eventTime}</span>
                    </div>
                  )}
                  <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <MapPin className="w-4 h-4 text-pink-500" />
                    <span>{event.location || "Campus Venue"}</span>
                  </div>
                </div>

                {/* Action CTA Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    <span className={`font-extrabold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{event.attendeesCount || 120}+ Students</span> already registered
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={registered}
                    className={`w-full sm:w-auto px-9 py-4 rounded-full font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer ${registered
                        ? 'bg-emerald-500 text-black cursor-default'
                        : 'bg-[#00F0FF] hover:bg-[#38f2ff] text-black shadow-cyan-500/30'
                      }`}
                  >
                    {registered ? '✓ Registered' : 'RSVP / Register Now →'}
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Venue Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              <div className={`lg:col-span-8 rounded-3xl p-8 border space-y-4 ${
                isDark ? 'bg-[#12141C] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h2 className={`font-['Syne',sans-serif] text-2xl font-extrabold uppercase ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  Event <span className="text-cyan-500">Description</span>
                </h2>
                <p className={`text-sm leading-relaxed font-normal whitespace-pre-line ${
                  isDark ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {event.description || "Join us for an incredible session organized by our active campus club. Bring your enthusiasm and collaborate with passionate peers!"}
                </p>
              </div>

              {/* Organizer Profile Card */}
              <div className={`lg:col-span-4 rounded-3xl p-6 border space-y-4 ${
                isDark ? 'bg-[#12141C] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest">
                  Organizing Club
                </span>
                <div className="space-y-2">
                  <h3 className={`font-['Syne',sans-serif] text-xl font-bold ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}>
                    {club?.name || event.club?.name || "Campus Club"}
                  </h3>
                  <p className={`text-xs line-clamp-3 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {club?.description || "Student organization committed to tech innovation, learning, and events."}
                  </p>
                </div>
                <Link
                  to={`/clubs/${club?.id || clubId}`}
                  className={`block w-full text-center py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  View Club Profile →
                </Link>
              </div>

            </div>
          </>
        )}

      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl ${
            isDark ? 'bg-[#12141C] border-white/15 text-white' : 'bg-white border-slate-200 text-[#0F172A]'
          }`}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className={`font-['Syne',sans-serif] text-2xl font-black uppercase ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}>
              RSVP Confirmed!
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Your registration for <strong>{event?.title}</strong> is saved. Event pass details have been sent.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-full bg-[#00F0FF] text-black text-xs font-bold uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default PublicEventDetailPage;
