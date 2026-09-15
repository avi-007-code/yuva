import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicApi } from '../../api/publicApi';
import PublicLayout from '../../components/public/PublicLayout';
import EventModal from '../../components/public/EventModal';
import GalleryLightbox from '../../components/public/GalleryLightbox';
import { getClubCoverImage } from '../../utils/clubCovers';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Users,
  Flame,
  Sparkles,
  MapPin,
  Clock,
  Ticket,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
} from 'lucide-react';

const PublicHomePage = () => {
  const navigate = useNavigate();

  // API State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [clubsError, setClubsError] = useState(null);

  // Modals & Lightbox
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeGalleryEvent, setActiveGalleryEvent] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');

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
      console.error('Error fetching upcoming events:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load upcoming events.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      setClubsLoading(true);
      setClubsError(null);
      const res = await publicApi.getClubs();
      const clubList =
        res.data?.clubs ||
        res.clubs ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      setClubs(clubList);
    } catch (err) {
      console.error('Error fetching clubs:', err);
      setClubsError(err.response?.data?.message || err.message || 'Failed to load campus clubs.');
    } finally {
      setClubsLoading(false);
    }
  };

  useEffect(() => {
    document.title = '4 THE PEOPLE | Discover Campus Clubs & Events';
    fetchUpcomingEvents();
    fetchClubs();
  }, []);

  // Format date helper
  const formatDateParts = (dateString) => {
    if (!dateString) return { day: '15', month: 'SEP' };
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return { day: '15', month: 'SEP' };
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return { day, month };
  };

  const categories = ['ALL', 'TECHNOLOGY', 'CULTURAL', 'SPORTS', 'ARTS', 'LITERARY', 'SOCIAL'];

  const categoryList = [
    { code: "01", name: "TECHNOLOGY", count: "14 CLUBS", eventsCount: "28 EVENTS", description: "AI, Software, Web3, Hackathons & Cloud Architectures.", accent: "#00F0FF" },
    { code: "02", name: "CULTURAL", count: "08 CLUBS", eventsCount: "16 EVENTS", description: "Music, Dance, Theatre, Festival Celebrations & Fests.", accent: "#EC4899" },
    { code: "03", name: "SPORTS", count: "10 CLUBS", eventsCount: "22 EVENTS", description: "Athletics, Esports, Tournaments & Fitness Leagues.", accent: "#F59E0B" },
    { code: "04", name: "ARTS", count: "06 CLUBS", eventsCount: "12 EVENTS", description: "Digital Illustration, Painting, Sculpting & UI/UX Design.", accent: "#8B5CF6" },
    { code: "05", name: "LITERARY", count: "05 CLUBS", eventsCount: "09 EVENTS", description: "Parliamentary Debate, Creative Writing, Journalism & Slams.", accent: "#10B981" },
    { code: "06", name: "SOCIAL", count: "07 CLUBS", eventsCount: "15 EVENTS", description: "Community Impact, Sustainability, Volunteering & Networking.", accent: "#3B82F6" },
  ];

  const benefits = [
    { num: "01", title: "MEET PEOPLE", description: "Find passionate communities and lifelong friends who share your exact energy and curiosity.", highlight: "Find your tribe" },
    { num: "02", title: "BUILD SKILLS", description: "Learn by actually doing. Organize large-scale events, build software, perform, and lead teams.", highlight: "Real hands-on experience" },
    { num: "03", title: "CREATE EXPERIENCES", description: "Turn raw ideas into memorable campus festivals, hackathons, open mics, and exhibitions.", highlight: "Make your mark" },
    { num: "04", title: "GROW TOGETHER", description: "Build a powerful network of peers, mentors, and alumni that opens doors far beyond college.", highlight: "Lifelong connections" },
  ];

  const featuredSpotlightEvent = events[0];

  return (
    <PublicLayout>

      {/* 1. ASYMMETRIC EDITORIAL HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 flex items-center overflow-hidden bg-[#0B0C10]">
        {/* Dynamic Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-pink-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-gray-300 backdrop-blur-md self-start mb-6 hover:border-cyan-500/40 transition-colors">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
                </span>
                <span className="text-[#00F0FF] font-bold">Fall 2026 Campus Fest Season</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">Club & Event Hub</span>
              </div>

              <h1 className="font-['Syne',sans-serif] text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tighter leading-[0.92] uppercase mb-6">
                FIND YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-cyan-200 to-white">
                  CAMPUS
                </span> <br />
                <span className="italic font-serif font-normal text-cyan-400 font-serif-override">
                  COMMUNITY.
                </span>
              </h1>

              <p className="text-gray-300 text-lg sm:text-xl max-w-xl font-normal leading-relaxed mb-8">
                Discover student-led clubs, meet people who match your wavelength, and jump into events that make campus life worth remembering.
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                <Link
                  to="/clubs"
                  className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#00F0FF] text-black font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 hover:bg-[#38f2ff] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Explore Clubs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#upcoming-events"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#00F0FF]" />
                  <span>Discover Events</span>
                </a>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-8 text-xs font-medium text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00F0FF]" />
                  <span><strong className="text-white font-bold text-sm">{clubs.length || 20}+</strong> Active Clubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-pink-400" />
                  <span><strong className="text-white font-bold text-sm">{events.length || 50}+</strong> Scheduled Events</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Poster Spotlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-2 shadow-2xl shadow-cyan-500/10">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gray-900 group">
                  <img
                    src={featuredSpotlightEvent?.bannerUrl || featuredSpotlightEvent?.coverUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop"}
                    alt={featuredSpotlightEvent?.title || "Spotlight Event"}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold uppercase tracking-widest text-[#00F0FF]">
                      ★ Spotlight Event
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#00F0FF] text-black text-[10px] font-black uppercase tracking-widest">
                      LIVE
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 z-10 space-y-2 text-white">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{featuredSpotlightEvent?.location || "Main Auditorium"}</span>
                    </div>
                    <h3 className="font-['Syne',sans-serif] text-2xl font-bold uppercase tracking-tight line-clamp-1">
                      {featuredSpotlightEvent?.title || "HACKSPRINT 2026"}
                    </h3>
                    <p className="text-xs text-gray-300 line-clamp-2">
                      {featuredSpotlightEvent?.description || "24-hour non-stop code sprint hosted on campus. Tech mentors & prizes."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Tag */}
              <div className="absolute -top-4 -right-4 hidden sm:block px-4 py-2 rounded-xl bg-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 z-20 rotate-3">
                ★ LIVE CAMPUS FEED
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED CLUBS SECTION */}
      <section id="featured-clubs" className="py-24 bg-[#0B0C10] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Campus Directory</span>
              </div>
              <h2 className="font-['Syne',sans-serif] text-4xl sm:text-6xl font-extrabold text-white uppercase tracking-tight">
                FIND YOUR <span className="text-[#00F0FF]">PEOPLE.</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-xl mt-2 font-normal">
                Explore vibrant communities built around what you love.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeCategory === cat
                      ? 'bg-[#00F0FF] text-black shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/25 hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Clubs Grid */}
          {clubsLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading campus clubs...</div>
          ) : clubsError ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">{clubsError}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {clubs.slice(0, 6).map((club, index) => {
                const isWide = index === 0;

                return (
                  <div
                    key={club.id}
                    onClick={() => navigate(`/clubs/${club.id}`)}
                    className={`group relative rounded-3xl overflow-hidden bg-[#12141C] border border-white/10 hover:border-cyan-500/40 transition-all duration-500 flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer ${isWide ? 'lg:col-span-2 lg:flex-row' : ''
                      }`}
                  >
                    <div className={`relative overflow-hidden bg-gray-900 ${isWide ? 'lg:w-1/2 min-h-[280px]' : 'h-56'} w-full`}>
                      <img
                        src={getClubCoverImage(club)}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#12141C]/80" />

                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-extrabold uppercase tracking-widest text-[#00F0FF]">
                          {club.category || 'CAMPUS CLUB'}
                        </span>
                      </div>
                    </div>

                    <div className={`p-6 sm:p-8 flex flex-col justify-between ${isWide ? 'lg:w-1/2' : 'w-full'}`}>
                      <div>
                        <h3 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase group-hover:text-[#00F0FF] transition-colors mb-3">
                          {club.name}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                          {club.description || "Student organization promoting innovation, collaboration, and learning on campus."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400">
                          {club._count?.members || club.membersCount || 250}+ Active Members
                        </span>

                        <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#00F0FF] group-hover:translate-x-1 transition-transform">
                          <span>Explore</span>
                          <ArrowUpRight className="w-4 h-4 text-[#00F0FF]" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 4. UPCOMING EVENTS SECTION */}
      <section id="upcoming-events" className="py-24 bg-[#0F1117] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Campus Calendar</span>
              </div>
              <h2 className="font-['Syne',sans-serif] text-4xl sm:text-6xl font-extrabold text-white uppercase tracking-tight">
                WHAT'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">HAPPENING?</span>
              </h2>
            </div>

            <p className="text-gray-400 text-sm sm:text-base max-w-md font-normal">
              RSVP for upcoming hackathons, open mics, workshops, and cultural nights happening across campus.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading upcoming events...</div>
          ) : error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">{error}</div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-[#12141C] rounded-3xl border border-white/10 text-gray-400">No events currently scheduled.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const dateParts = formatDateParts(event.date || event.startDate);
                const clubId = event.club?.id || event.clubId || 'public';

                return (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/clubs/${clubId}/events/${event.id}`)}
                    className="group relative rounded-2xl overflow-hidden bg-[#12141C] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                      <img
                        src={event.coverUrl || event.bannerUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-black/40 to-transparent" />

                      <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-center min-w-[54px]">
                        <span className="block font-['Syne',sans-serif] text-xl font-black text-white leading-none">
                          {dateParts.day}
                        </span>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          {dateParts.month}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-400">
                          <span>By <strong className="text-white">{event.club?.name || "Campus Club"}</strong></span>
                        </div>

                        <h3 className="font-['Syne',sans-serif] text-xl font-bold text-white uppercase tracking-tight group-hover:text-[#00F0FF] transition-colors mb-2">
                          {event.title}
                        </h3>

                        <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed mb-4">
                          {event.description || "Join us for an exciting campus event."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400">
                          <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                            <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <span className="truncate">{event.location || "Campus Venue"}</span>
                          </span>
                        </div>

                        <div className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 group-hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors">
                          <span>VIEW EVENT</span>
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 5. EVENT CATEGORIES SECTION */}
      <section className="py-24 bg-[#0B0C10] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>Explore By Interest</span>
              </div>
              <h2 className="font-['Syne',sans-serif] text-4xl sm:text-6xl font-extrabold text-white uppercase tracking-tight">
                EVENT <span className="text-[#00F0FF]">CATEGORIES</span>
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {categoryList.map((cat) => (
              <div
                key={cat.code}
                className="group relative rounded-2xl p-6 sm:p-8 border border-white/10 bg-[#0F1117] hover:bg-[#151824] hover:border-cyan-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-6 sm:gap-10">
                    <span className="font-['Syne',sans-serif] text-2xl sm:text-4xl font-extrabold text-gray-500 group-hover:text-[#00F0FF] transition-colors">
                      {cat.code}
                    </span>

                    <div>
                      <h3 className="font-['Syne',sans-serif] text-2xl sm:text-4xl font-extrabold text-gray-200 group-hover:text-white uppercase tracking-tight transition-all">
                        {cat.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 font-normal mt-1 max-w-lg">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-0 border-white/10">
                    <div className="text-left sm:text-right">
                      <span className="block text-xs font-bold text-gray-300 uppercase tracking-widest">{cat.count}</span>
                    </div>

                    <div className="w-12 h-12 rounded-full flex items-center justify-center border border-white/15 bg-white/5 text-gray-400 group-hover:bg-[#00F0FF] group-hover:text-black transition-all">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. WHY JOIN SECTION */}
      <section className="py-24 bg-[#0F1117] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why Join A Club</span>
            </div>

            <h2 className="font-['Syne',sans-serif] text-4xl sm:text-6xl font-extrabold text-white uppercase tracking-tight leading-[0.95]">
              CAMPUS IS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-cyan-200 to-pink-400">
                BETTER TOGETHER.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {benefits.map((item) => (
              <div
                key={item.num}
                className="group relative p-8 sm:p-10 rounded-3xl bg-[#12141C] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-['Syne',sans-serif] text-4xl sm:text-5xl font-black text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity">
                      {item.num}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold">
                      {item.highlight}
                    </span>
                  </div>

                  <h3 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight mb-3 group-hover:text-[#00F0FF] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Available to all students</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="py-28 bg-[#0B0C10] border-t border-white/10 relative overflow-hidden text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-[#00F0FF] text-xs font-bold uppercase tracking-widest border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join The Campus Movement</span>
          </div>

          <h2 className="font-['Syne',sans-serif] text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9]">
            YOUR CAMPUS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-cyan-200 to-white">
              YOUR PEOPLE.
            </span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              YOUR MOMENT.
            </span>
          </h2>

          <p className="text-gray-300 text-lg sm:text-xl font-normal max-w-xl mx-auto">
            There is a place for you here. Discover clubs, join events, and take the lead.
          </p>

          <div className="pt-4">
            <Link
              to="/clubs"
              className="inline-flex items-center gap-3 px-9 py-5 rounded-full bg-[#00F0FF] text-black font-extrabold text-sm uppercase tracking-wider shadow-2xl shadow-cyan-500/30 hover:bg-[#38f2ff] hover:scale-105 transition-all cursor-pointer"
            >
              <span>EXPLORE CLUBS →</span>
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
};

export default PublicHomePage;
