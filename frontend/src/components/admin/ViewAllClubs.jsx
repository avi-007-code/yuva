import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion"; // uncomment if you want animations

const ViewAllClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized access. Please log in.");
          navigate("/signin");
          return;
        }

        const response = await axios.get(`${API_BASE}/api/admin/viewAllClubs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.data || [];
        setClubs(data);
        setFilteredClubs(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          console.error("Error fetching clubs:", error);
          alert("Failed to fetch clubs. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [API_BASE, navigate]);

  // Search clubs
  useEffect(() => {
    const s = search.toLowerCase();
    const filtered = clubs.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        (c.description && c.description.toLowerCase().includes(s))
    );
    setFilteredClubs(filtered);
  }, [search, clubs]);

  // Club Avatar Generator
  const getAvatar = (name) => {
    const letter = name[0].toUpperCase();

    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
    ];
    const color = colors[name.length % colors.length];

    return { letter, color };
  };

  // Loading screen
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );

  if (!filteredClubs.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No clubs found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Clubs</h1>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search clubs by name or description..."
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredClubs.map((club) => {
            const avatar = getAvatar(club.name);

            return (
              // <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <div
                key={club.id}
                className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition-all cursor-pointer"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 flex items-center justify-center text-white text-xl font-bold rounded-full ${avatar.color}`}
                  >
                    {avatar.letter}
                  </div>
                  <h2 className="text-xl font-semibold">{club.name}</h2>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-3">
                  {club.description || "No description provided"}
                </p>

                {/* Members */}
                {club.members && (
                  <p className="text-gray-600 text-sm">
                    👥 Members: {club.members.length}
                  </p>
                )}
              </div>
              // </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewAllClubs;
