import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized access. Please log in.");
          window.location.href = "/signin";
          return;
        }

        const port = import.meta.env.PORT || 3000;

        const response = await axios.get(
          `http://localhost:${port}/api/admin/viewAllUsers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  // Handle user selection
  const handleUserSelect = (id) => {
    const user = users.find((u) => u.id === id);
    setSelectedUser(user);
  };

  // Avatar generator (initials + background color)
  const getAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500"];
    const color = colors[name.length % colors.length];

    return { initials, color };
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">View Users</h1>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search user by name..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 shadow-sm focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* User dropdown */}
        <select
          onChange={(e) => handleUserSelect(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 shadow"
        >
          <option value="">Select a user</option>
          {filteredUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Selected user details */}
        {selectedUser && (
          <div className="mt-6 p-6 border rounded-lg shadow bg-gray-50">
            <div className="flex items-center space-x-4 mb-4">
              {/* Avatar */}
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full text-white text-2xl font-bold ${getAvatar(selectedUser.name).color}`}
              >
                {getAvatar(selectedUser.name).initials}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
            </div>

            <p className="text-gray-700">
              <span className="font-semibold">User ID:</span> {selectedUser.id}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUser;
