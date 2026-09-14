import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../api/publicApi';
import PublicLayout from '../../components/public/PublicLayout';
import { Compass, Search, Building2, AlertCircle, RefreshCw, ArrowUpRight, Sparkles, Users } from 'lucide-react';

const PublicClubsListPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const navigate = useNavigate();

  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await publicApi.getClubs();
      const clubList =
        res.data?.clubs ||
        res.clubs ||
        (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      setClubs(clubList);
    } catch (err) {
      console.error('Error fetching public clubs list:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load clubs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Explore Campus Clubs | ClubHub';
    fetchClubs();
  }, []);

  const categories = ['ALL', 'TECHNOLOGY', 'CULTURAL', 'SPORTS', 'ARTS', 'LITERARY', 'SOCIAL'];

  const filteredClubs = clubs.filter((club) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      club.name?.toLowerCase().includes(term) ||
      club.description?.toLowerCase().includes(term) ||
      club.category?.toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === 'ALL' ||
      (club.category && club.category.toUpperCase().includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <PublicLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Directory</span>
            </div>
            <h1 className="font-['Syne',sans-serif] text-4xl sm:text-6xl font-extrabold text-white uppercase tracking-tight">
              FIND YOUR <span className="text-[#00F0FF]">COMMUNITY.</span>
            </h1>
            <p className="text-gray-400 text-base max-w-xl mt-2">
              Join active campus clubs, connect with passionate peers, and participate in exciting projects & workshops.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs by name..."
              className="w-full pl-11 pr-4 py-3 bg-[#12141C] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF] text-sm transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00F0FF] text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-red-300">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 text-red-400" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={fetchClubs}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold uppercase tracking-wider rounded-xl border border-red-500/40 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredClubs.length === 0 && (
          <div className="text-center py-16 bg-[#12141C] rounded-3xl border border-white/10 text-gray-400 space-y-3">
            <Building2 className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="font-['Syne',sans-serif] text-xl font-bold text-white uppercase">
              {searchQuery ? "No Matching Clubs" : "No Clubs Found"}
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchQuery ? `No clubs match "${searchQuery}". Try a different keyword.` : "No student clubs are currently registered."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 px-4 py-2 rounded-full bg-[#00F0FF] text-black text-xs font-bold uppercase"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Clubs Grid */}
        {!loading && !error && filteredClubs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                onClick={() => navigate(`/clubs/${club.id}`)}
                className="group relative rounded-3xl overflow-hidden bg-[#12141C] border border-white/10 hover:border-cyan-500/40 transition-all duration-500 flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
              >
                <div className="relative h-52 w-full overflow-hidden bg-gray-900">
                  <img
                    src={club.coverImage || club.logoUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-extrabold uppercase tracking-widest text-[#00F0FF]">
                      {club.category || 'CAMPUS CLUB'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Syne',sans-serif] text-2xl font-extrabold text-white tracking-tight uppercase group-hover:text-[#00F0FF] transition-colors mb-3">
                      {club.name}
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 mb-6">
                      {club.description || "Student organization promoting learning, technical skills, and collaboration."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{club._count?.members || club.membersCount || 100}+ Members</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#00F0FF] group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowUpRight className="w-4 h-4 text-[#00F0FF]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PublicLayout>
  );
};

export default PublicClubsListPage;
