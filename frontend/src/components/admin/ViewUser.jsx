import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:${import.meta.env.VITE_API_PORT}/api/admin/viewAllUsers`
        );
        console.log("API Response:", response.data); // Debugging log
        if (response.data && response.data.data) {
          setUsers(response.data.data);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">View User</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <select
                onChange={(e) => handleUserSelect(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a user</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedUser && (
              <div className="mt-4 p-4 border border-gray-300 rounded">
                <h2 className="text-xl font-semibold">User Details</h2>
                <p>ID: {selectedUser.id}</p>
                <p>Name: {selectedUser.name}</p>
                <p>Email: {selectedUser.email}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewUser;