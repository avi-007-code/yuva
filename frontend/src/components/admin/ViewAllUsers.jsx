import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized access. Please log in.");
          navigate("/signin");
          return;
        }

        const response = await axios.get(`${API_BASE}/api/admin/viewAllUsers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.data || [];
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          console.error("Error fetching users:", error);
          alert("Failed to fetch users. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_BASE, navigate]);

  // Search Users
  useEffect(() => {
    const s = search.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  // Avatar Generator (Initials + Color)
  const getAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
    ];
    const color = colors[name.length % colors.length];

    return { initials, color };
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Users</h1>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* User Table */}
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No users found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const avatar = getAvatar(user.name);

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      {/* Avatar + Name */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${avatar.color}`}
                        >
                          {avatar.initials}
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.name}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {user.email}
                      </td>

                      <td className="px-6 py-4 capitalize text-gray-700">
                        {user.role}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllUsers;
