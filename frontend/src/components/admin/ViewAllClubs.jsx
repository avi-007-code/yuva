import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAllClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:${import.meta.env.VITE_API_PORT}/api/admin/viewAllClubs`
        );
        console.log("API Response:", response.data); // Debugging log
        if (response.data && response.data.data) {
          setClubs(response.data.data);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
        alert("Failed to fetch clubs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-4">All Clubs</h1>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {clubs.map((club) => (
              <li key={club.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {club.name}
                    </p>
                    <p className="text-sm text-gray-600">ID: {club.id}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewAllClubs;