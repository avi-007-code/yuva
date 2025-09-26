import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized access. Please log in.");
          window.location.href = "/signin";
          return;
        }

        const port = import.meta.env.PORT || 3000; // Fallback to port 3000
        console.log("API Port:", port); // Debugging log

        const response = await axios.get(
          `http://localhost:${port}/api/admin/viewAllUsers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/signin";
        } else {
          console.error("Error fetching users:", error);
          alert("Failed to fetch users. Please try again later.");
        }
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">View User</h1>
        <div className="mb-4">
          <select
            onChange={(e) => handleUserSelect(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
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
      </div>
    </div>
  );
};

export default ViewUser;