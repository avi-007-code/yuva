import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteClub = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  const handleDeleteClub = async (clubId) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/admin/deleteClub/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Club deleted successfully!");
      setClubs(clubs.filter((c) => c.id !== clubId));
    } catch (err) {
      console.error("Error deleting club:", err);
      alert("Failed to delete club");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Clubs</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading clubs...</p>
        ) : clubs.length === 0 ? (
          <p>No clubs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">{club.name}</h2>
                  <p className="text-gray-700 mb-1">
                    <strong>Description:</strong> {club.description}
                  </p>
                  {club.members && (
                    <p className="text-gray-700 mb-1">
                      <strong>Members:</strong> {club.members.length}
                    </p>
                  )}
                  {club.createdAt && (
                    <p className="text-gray-700">
                      <strong>Created At:</strong>{" "}
                      {new Date(club.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteClub(club.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteClub;
