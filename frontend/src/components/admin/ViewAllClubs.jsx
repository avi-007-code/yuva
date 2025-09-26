import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAllClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
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

        setClubs(response.data.data || []);
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading clubs...</p>
      </div>
    );

  if (!clubs.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No clubs found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Clubs</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{club.name}</h2>
                <p className="text-gray-700">{club.description}</p>
              </div>
              {club.members && (
                <p className="mt-2 text-gray-600">
                  Members: {club.members.length}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAllClubs;
