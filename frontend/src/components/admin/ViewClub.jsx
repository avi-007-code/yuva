// ViewClub.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewClub = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubDetails, setClubDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Base URL from Vite env
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE}/api/admin/viewAllClubs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClubs(res.data.data || []);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        alert("Failed to fetch clubs");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [API_BASE]);

  const handleSelectClub = async (clubId) => {
    setSelectedClub(clubId);
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/api/admin/viewClub/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClubDetails(res.data.data || null);
    } catch (err) {
      console.error("Error fetching club details:", err);
      alert("Failed to fetch club details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">View Clubs</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {/* Dropdown Menu */}
        <select
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => handleSelectClub(e.target.value)}
          value={selectedClub || ""}
        >
          <option value="">Select a club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>

        {/* Club Details */}
        {clubDetails && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">
              {clubDetails.name}
            </h2>
            <p>
              <strong>Description:</strong> {clubDetails.description}
            </p>
            {clubDetails.createdAt && (
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(clubDetails.createdAt).toLocaleDateString()}
              </p>
            )}
            {clubDetails.members && (
              <p>
                <strong>Members:</strong> {clubDetails.members.length}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewClub;
