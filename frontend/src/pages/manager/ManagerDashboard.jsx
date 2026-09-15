import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { managerApi } from '../../api/managerApi';
import {
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  PlusCircle,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import { ClubCardSkeleton } from '../../components/common/CardSkeleton';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalMembers, setTotalMembers] = useState(0);
  const [allEvents, setAllEvents] = useState([]);
  const [activeSection, setActiveSection] = useState('OVERVIEW');

  // Quick Create Event Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartAt, setEventStartAt] = useState('');
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createEventError, setCreateEventError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await managerApi.getMyClubs();
      const clubList =
        res.data?.clubs ||
        res.clubs ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);

      // Fetch detailed club dashboards & events in parallel
      let memberCount = 0;
      let fetchedEvents = [];

      const detailedClubs = await Promise.all(
        clubList.map(async (c) => {
          try {
            const detailRes = await managerApi.getClubDashboard(c.id);
            const clubObj = detailRes.data?.club || detailRes.data || detailRes || c;

            if (clubObj.members && Array.isArray(clubObj.members)) {
              memberCount += clubObj.members.length;
            }

            // Fetch events for this club
            try {
              const eventsRes = await managerApi.getClubEvents(c.id);
              const eventItems =
                eventsRes.data?.events ||
                eventsRes.events ||
                (Array.isArray(eventsRes.data) ? eventsRes.data : Array.isArray(eventsRes) ? eventsRes : []);

              const formatted = eventItems.map((evt) => ({
                ...evt,
                clubName: clubObj.name || c.name,
                clubId: c.id,
              }));
              fetchedEvents = [...fetchedEvents, ...formatted];
            } catch (evtErr) {
              // Ignore individual event fetch errors
            }

            return clubObj;
          } catch {
            return c;
          }
        })
      );

      setClubs(detailedClubs);
      setTotalMembers(memberCount);
      setAllEvents(fetchedEvents);

      if (detailedClubs.length > 0) {
        setSelectedClubId(detailedClubs[0].id);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setClubs([]);
      } else {
        setError(err.response?.data?.message || 'Failed to load manager dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Manager Dashboard | 4 THE PEOPLE";
    fetchDashboardData();
  }, []);

  const storedUser = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('managerUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const managerName = user?.name || storedUser?.name || (user?.email ? user.email.split('@')[0] : 'Manager');

  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClubId || !eventTitle) {
      setCreateEventError('Please select a club and provide an event title.');
      return;
    }

    try {
      setCreatingEvent(true);
      setCreateEventError('');

      await managerApi.createEvent(selectedClubId, {
        title: eventTitle,
        description: eventDesc,
        location: eventLocation,
        startAt: eventStartAt || new Date().toISOString(),
      });

      setShowCreateModal(false);
      setEventTitle('');
      setEventDesc('');
      setEventLocation('');
      setEventStartAt('');

      fetchDashboardData();
    } catch (err) {
      setCreateEventError(err.response?.data?.message || err.message || 'Failed to publish event.');
    } finally {
      setCreatingEvent(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* YUUVA DASHBOARD HEADER */}
      <div className={`rounded-3xl p-6 sm:p-8 border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 ${isDark
          ? 'bg-[#151D2A] border-slate-800 shadow-xl'
          : 'bg-white border-[#E2E0D5] shadow-sm'
        }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-black uppercase tracking-wider border border-[#3B82F6]/20">
              Manager Workspace
            </span>
            <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              Welcome back, <strong className={isDark ? 'text-slate-100' : 'text-[#0F172A]'}>{managerName}</strong>
            </span>
          </div>

          <h1 className={`font-['Syne',sans-serif] text-3xl sm:text-4xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'
            }`}>
            What's happening with <span className="text-[#FF5733]">my clubs?</span>
          </h1>

          <p className={`text-xs font-medium max-w-xl ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
            Oversee your assigned clubs, publish upcoming campus events, monitor member activity, and manage registrations.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {clubs.length > 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF5733] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#FF5733]/25 hover:bg-[#E64A26] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}

          <button
            onClick={() => navigate('/manager/clubs')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-100 hover:bg-slate-800'
                : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A] hover:bg-[#F0EEE6]'
              }`}
          >
            <Building2 className="w-4 h-4 text-[#3B82F6]" />
            <span>Manage Clubs ({clubs.length})</span>
          </button>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${isDark ? 'bg-rose-950/40 border-rose-800 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-black uppercase rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={`rounded-3xl p-6 border relative overflow-hidden group hover:border-[#FF5733]/50 transition-all ${isDark ? 'bg-[#151D2A] border-slate-800 shadow-xl' : 'bg-white border-[#E2E0D5] shadow-sm'
          }`}>
          <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
            Managed Clubs
          </span>
          <div className={`font-['Syne',sans-serif] text-4xl font-black mt-1 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {loading ? '...' : clubs.length}
          </div>
          <p className="text-[11px] text-[#3B82F6] font-bold mt-1">Assigned manager access</p>
          <div className={`absolute right-4 bottom-4 p-3 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-[#FAF9F5] border-[#E8E6DF]'
            }`}>
            <Building2 className="w-5 h-5 text-[#FF5733]" />
          </div>
        </div>

        <div className={`rounded-3xl p-6 border relative overflow-hidden group hover:border-[#3B82F6]/50 transition-all ${isDark ? 'bg-[#151D2A] border-slate-800 shadow-xl' : 'bg-white border-[#E2E0D5] shadow-sm'
          }`}>
          <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
            Total Club Members
          </span>
          <div className="font-['Syne',sans-serif] text-4xl font-black text-[#3B82F6] mt-1">
            {loading ? '...' : totalMembers > 0 ? totalMembers : '—'}
          </div>
          <p className="text-[11px] text-emerald-500 font-bold mt-1">Enrolled students across clubs</p>
          <div className={`absolute right-4 bottom-4 p-3 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-[#FAF9F5] border-[#E8E6DF]'
            }`}>
            <Users className="w-5 h-5 text-[#3B82F6]" />
          </div>
        </div>

        <div className={`rounded-3xl p-6 border relative overflow-hidden group hover:border-[#FF5733]/50 transition-all ${isDark ? 'bg-[#151D2A] border-slate-800 shadow-xl' : 'bg-white border-[#E2E0D5] shadow-sm'
          }`}>
          <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
            Total Club Events
          </span>
          <div className="font-['Syne',sans-serif] text-4xl font-black text-[#FF5733] mt-1">
            {loading ? '...' : allEvents.length}
          </div>
          <p className={`text-[11px] font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>Active & upcoming events</p>
          <div className={`absolute right-4 bottom-4 p-3 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-[#FAF9F5] border-[#E8E6DF]'
            }`}>
            <Calendar className="w-5 h-5 text-[#FF5733]" />
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB SELECTOR */}
      <div className={`flex items-center gap-2 border-b pb-3 overflow-x-auto ${isDark ? 'border-slate-800' : 'border-[#E2E0D5]'}`}>
        {['OVERVIEW', 'MY CLUBS', 'EVENTS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${activeSection === tab
                ? 'bg-[#FF5733] text-white shadow-md shadow-[#FF5733]/20'
                : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F0EEE6]'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW OR CLUBS TAB */}
      {(activeSection === 'OVERVIEW' || activeSection === 'MY CLUBS') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`font-['Syne',sans-serif] text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'
                }`}>
                My Managed Clubs
              </h2>
              <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                Select any club to update information, upload logos, manage events, and view details.
              </p>
            </div>
            {clubs.length > 0 && (
              <button
                onClick={() => navigate('/manager/clubs')}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#FF5733] hover:underline uppercase tracking-wider"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ClubCardSkeleton />
              <ClubCardSkeleton />
            </div>
          )}

          {!loading && !error && clubs.length === 0 && (
            <EmptyState
              icon={Building2}
              title="No Managed Clubs Assigned"
              description="You are not currently assigned to manage any clubs. Please contact an administrator to get access."
            />
          )}

          {!loading && !error && clubs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => {
                const logoUrl = club.logo?.url;
                const initials = club.name ? club.name.slice(0, 2).toUpperCase() : 'CL';

                return (
                  <div
                    key={club.id}
                    onClick={() => navigate(`/manager/clubs/${club.id}`)}
                    className={`group border rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${isDark
                        ? 'bg-[#151D2A] hover:bg-[#1A2436] border-slate-800 hover:border-[#FF5733]/60'
                        : 'bg-white hover:bg-[#FAF9F5] border-[#E2E0D5] hover:border-[#FF5733]'
                      }`}
                  >
                    <div className="space-y-4">
                      {/* Club Header */}
                      <div className="flex items-center gap-4">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={club.name}
                            className={`w-14 h-14 rounded-2xl object-cover border shadow-xs group-hover:scale-105 transition-transform ${isDark ? 'border-slate-700' : 'border-[#E2E0D5]'
                              }`}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-[#FF5733] flex items-center justify-center text-white font-['Syne',sans-serif] font-black text-xl shadow-md shadow-[#FF5733]/25 group-hover:scale-105 transition-transform">
                            {initials}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className={`font-['Syne',sans-serif] text-lg font-bold group-hover:text-[#FF5733] transition truncate ${isDark ? 'text-white' : 'text-[#0F172A]'
                            }`}>
                            {club.name}
                          </h3>
                          <span className="text-[10px] text-[#3B82F6] font-black uppercase tracking-wider bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-[#3B82F6]/20">
                            Manager Access
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-xs line-clamp-3 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-[#64748B]'
                        }`}>
                        {club.description || 'No description provided for this club.'}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className={`pt-4 mt-6 border-t flex items-center justify-between text-xs ${isDark ? 'border-slate-800' : 'border-[#E8E6DF]'
                      }`}>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#64748B]'
                        }`}>
                        {club.members ? `${club.members.length} Members` : 'Manage Details'}
                      </span>
                      <div className="flex items-center gap-1 font-extrabold text-[#FF5733] group-hover:translate-x-1 transition-transform uppercase text-[11px] tracking-wider">
                        <span>Open Club</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* EVENTS TAB */}
      {(activeSection === 'EVENTS' || (activeSection === 'OVERVIEW' && allEvents.length > 0)) && (
        <div className={`rounded-3xl p-6 border shadow-sm space-y-4 ${isDark ? 'bg-[#151D2A] border-slate-800' : 'bg-white border-[#E2E0D5]'
          }`}>
          <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-[#E8E6DF]'
            }`}>
            <div>
              <h3 className={`font-['Syne',sans-serif] text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'
                }`}>
                Published Events ({allEvents.length})
              </h3>
              <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                All events created across your managed clubs.
              </p>
            </div>
            {clubs.length > 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5733] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:bg-[#E64A26] transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Event</span>
              </button>
            )}
          </div>

          {allEvents.length === 0 ? (
            <div className={`py-8 text-center text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              No published events yet for your managed clubs.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b uppercase font-black tracking-wider ${isDark ? 'border-slate-800 text-slate-400' : 'border-[#F0EEE6] text-[#64748B]'
                    }`}>
                    <th className="py-3 px-3">Event Title</th>
                    <th className="py-3 px-3">Club</th>
                    <th className="py-3 px-3">Start Date</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/80' : 'divide-[#F0EEE6]'}`}>
                  {allEvents.map((e) => (
                    <tr key={e.id} className={`transition ${isDark ? 'hover:bg-[#1A2436]' : 'hover:bg-[#FAF9F5]'}`}>
                      <td className={`py-3.5 px-3 font-extrabold ${isDark ? 'text-slate-100' : 'text-[#0F172A]'}`}>{e.title}</td>
                      <td className="py-3.5 px-3 font-semibold text-[#3B82F6]">{e.clubName || 'My Club'}</td>
                      <td className={`py-3.5 px-3 font-medium ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
                        {e.startAt ? new Date(e.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                      </td>
                      <td className={`py-3.5 px-3 font-medium ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>{e.location || 'TBA'}</td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => navigate(`/manager/clubs/${e.clubId}/events/${e.id}`)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition ${isDark
                              ? 'bg-slate-800 hover:bg-[#3B82F6] text-white border border-slate-700'
                              : 'bg-[#0F172A] hover:bg-[#2563EB] text-white'
                            }`}
                        >
                          Manage Event
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEventSubmit}
            className={`rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border ${isDark
                ? 'bg-[#151D2A] border-slate-700 text-slate-100'
                : 'bg-white border-[#E2E0D5] text-[#0F172A]'
              }`}
          >
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-[#E8E6DF]'
              }`}>
              <h3 className={`font-['Syne',sans-serif] text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'
                }`}>
                Create New Event
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className={`text-sm font-bold p-1.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-[#FAF9F5] text-[#64748B] hover:text-[#0F172A]'
                  }`}
              >
                ✕
              </button>
            </div>

            {createEventError && (
              <div className={`p-3 text-xs font-bold rounded-xl border ${isDark ? 'bg-rose-950/50 border-rose-800 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                {createEventError}
              </div>
            )}

            <div>
              <label className={`block text-xs font-extrabold uppercase mb-1 ${isDark ? 'text-slate-200' : 'text-[#0F172A]'}`}>
                Select Managed Club
              </label>
              <select
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-xs font-bold focus:outline-none focus:border-[#FF5733] ${isDark
                    ? 'bg-[#0B0F17] border-slate-700 text-slate-100'
                    : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A]'
                  }`}
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-extrabold uppercase mb-1 ${isDark ? 'text-slate-200' : 'text-[#0F172A]'}`}>
                Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AI Hackathon 2026"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-xs font-medium focus:outline-none focus:border-[#FF5733] ${isDark
                    ? 'bg-[#0B0F17] border-slate-700 text-slate-100 placeholder-slate-500'
                    : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A]'
                  }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-extrabold uppercase mb-1 ${isDark ? 'text-slate-200' : 'text-[#0F172A]'}`}>
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Campus Auditorium / Online Zoom"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-xs font-medium focus:outline-none focus:border-[#FF5733] ${isDark
                    ? 'bg-[#0B0F17] border-slate-700 text-slate-100 placeholder-slate-500'
                    : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A]'
                  }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-extrabold uppercase mb-1 ${isDark ? 'text-slate-200' : 'text-[#0F172A]'}`}>
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={eventStartAt}
                onChange={(e) => setEventStartAt(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-xs font-medium focus:outline-none focus:border-[#FF5733] ${isDark
                    ? 'bg-[#0B0F17] border-slate-700 text-slate-100'
                    : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A]'
                  }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-extrabold uppercase mb-1 ${isDark ? 'text-slate-200' : 'text-[#0F172A]'}`}>
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Short event overview..."
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-xs font-medium focus:outline-none focus:border-[#FF5733] ${isDark
                    ? 'bg-[#0B0F17] border-slate-700 text-slate-100 placeholder-slate-500'
                    : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A]'
                  }`}
              />
            </div>

            <div className={`flex justify-end gap-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-[#E8E6DF]'}`}>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className={`px-5 py-2.5 rounded-full border text-xs font-extrabold uppercase tracking-wider ${isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    : 'bg-[#FAF9F5] border-[#E2E0D5] text-[#0F172A] hover:bg-[#F0EEE6]'
                  }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingEvent}
                className="px-6 py-2.5 rounded-full bg-[#FF5733] text-white text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#E64A26] disabled:opacity-50 cursor-pointer"
              >
                {creatingEvent ? 'Publishing...' : 'Publish Event'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
