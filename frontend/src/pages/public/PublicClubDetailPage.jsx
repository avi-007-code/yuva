import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicApi } from '../../api/publicApi';
import PublicLayout from '../../components/public/PublicLayout';
import EventModal from '../../components/public/EventModal';
import GalleryLightbox from '../../components/public/GalleryLightbox';
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
  Users,
  ArrowRight,
  ShieldCheck,
  Mail,
} from 'lucide-react';

const formatDateParts = (dateString) => {
  if (!dateString) return { day: '15', month: 'SEP' };
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return { day: '15', month: 'SEP' };
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return { day, month };
};

const PublicClubDetailPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [clubLoading, setClubLoading] = useState(true);
  const [clubError, setClubError] = useState(null);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState(null);

  const [pastEvents, setPastEvents] = useState([]);
  const [pastLoading, setPastLoading] = useState(true);
  const [pastError, setPastError] = useState(null);

  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [activeGalleryEvent, setActiveGalleryEvent] = useState(null);

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
    if (club?.name) {
      document.title = `${club.name} | ClubHub`;
    } else {
      document.title = 'Club Details | ClubHub';
    }
  }, [club]);

  useEffect(() => {
    if (clubId) {
      fetchClubInfo();
      fetchUpcomingEvents();
      fetchPastEvents();
    }
  }, [clubId]);

  return (
    <PublicLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/clubs')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-extrabold uppercase text-gray-300 hover:text-white hover:border-white/20 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Clubs</span>
        </button>

        {/* Club Profile Hero Section */}
        {clubLoading ? (
          <div className="h-64 rounded-3xl bg-white/5 border border-white/5 animate-pulse" />
        ) : clubError ? (
          <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-xl font-extrabold text-white font-['Syne',sans-serif]">Club Not Found</h2>
            <p className="text-sm text-red-300">{clubError}</p>
            <button
              onClick={fetchClubInfo}
              className="px-5 py-2.5 bg-red-500/20 text-red-200 rounded-full text-xs font-bold uppercase"
            >
              Retry
            </button>
          </div>
        ) : club ? (
          <div className="rounded-3xl bg-[#12141C] border border-white/10 overflow-hidden shadow-2xl">
            <div className="relative h-56 sm:h-72 bg-gray-900 overflow-hidden">
              <img
                src={club.coverImage || club.logoUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"}
                alt={club.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-black/30 to-transparent" />

              <div className="absolute top-4 right-4">
                <span className="px-3.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-extrabold uppercase tracking-widest text-[#00F0FF]">
                  {club.category || "CAMPUS ORGANIZATION"}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-10 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-12 sm:-mt-16 mb-6">
                <div className="flex items-end gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-[#12141C] shadow-xl bg-gray-900 shrink-0">
                    <img
                      src={club.logoUrl || club.coverImage || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=200&auto=format&fit=crop"}
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#00F0FF] tracking-widest">{club.category}</span>
                    <h1 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                      {club.name}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold">
                    {club._count?.members || club.membersCount || 100}+ Members
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed max-w-4xl font-normal">
                {club.description || "Active student organization committed to fostering skills, projects, and collaboration across campus."}
              </p>
            </div>
          </div>
        ) : null}

        {/* Upcoming Events Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-[#00F0FF]">Live Schedule</span>
              <h2 className="font-['Syne',sans-serif] text-2xl font-extrabold text-white uppercase">
                Upcoming <span className="text-[#00F0FF]">Events</span>
              </h2>
            </div>
          </div>

          {upcomingLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading upcoming events...</div>
          ) : upcomingError ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">{upcomingError}</div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-[#12141C] rounded-3xl border border-white/10 text-gray-400 text-sm">
              No upcoming events currently scheduled for {club?.name || 'this club'}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((evt) => {
                const dateParts = formatDateParts(evt.date || evt.startDate);
                return (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/clubs/${clubId}/events/${evt.id}`)}
                    className="group rounded-2xl overflow-hidden bg-[#12141C] border border-white/10 hover:border-cyan-500/40 transition-all p-5 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/20 text-white flex flex-col items-center justify-center font-['Syne',sans-serif] leading-none shrink-0">
                          <span className="text-[9px] text-[#00F0FF] font-bold uppercase">{dateParts.month}</span>
                          <span className="text-lg font-black">{dateParts.day}</span>
                        </div>
                        <div>
                          <h3 className="font-['Syne',sans-serif] text-lg font-bold text-white group-hover:text-[#00F0FF] transition-colors line-clamp-1">
                            {evt.title}
                          </h3>
                          <span className="text-xs text-gray-400">{evt.location || "Main Auditorium"}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-4">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#00F0FF]">
                      <span>RSVP Open</span>
                      <span className="group-hover:translate-x-1 transition-transform">View Details →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Past Events & Gallery Section */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-purple-400">Archives</span>
              <h2 className="font-['Syne',sans-serif] text-2xl font-extrabold text-white uppercase">
                Past Events & <span className="text-purple-400">Gallery</span>
              </h2>
            </div>
          </div>

          {!pastLoading && !pastError && pastEvents.length === 0 && (
            <div className="text-center py-12 bg-[#12141C] rounded-3xl border border-white/10 text-gray-400 text-sm">
              No completed past events recorded yet.
            </div>
          )}

          {!pastLoading && !pastError && pastEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setActiveGalleryEvent(evt)}
                  className="group bg-[#12141C] border border-white/10 hover:border-purple-400/50 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-gray-900 overflow-hidden">
                    <img
                      src={evt.coverUrl || evt.bannerUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop"}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold uppercase backdrop-blur-md">
                      COMPLETED
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-['Syne',sans-serif] text-lg font-bold text-white group-hover:text-purple-300 transition line-clamp-1">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-bold">
                      <span>Completed Event</span>
                      <span className="group-hover:underline">View Gallery →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

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
