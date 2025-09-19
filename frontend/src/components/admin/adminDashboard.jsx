import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/admin/viewAllUsers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUsers(response.data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <div className="flex">
        <nav className="w-1/4 bg-white shadow-md p-4">
          <ul className="space-y-4">
            <li className="text-blue-600 font-semibold">Home</li>
            <li className="text-gray-700">
              <Link to="/admin/view-all-clubs">View All Clubs</Link>
            </li>
            <li className="text-gray-700">
              <Link to="/admin/view-user">View User</Link>
            </li>
            <li className="text-gray-700">
              <Link to="/admin/delete-user">Delete User</Link>
            </li>
            <li className="text-gray-700">
              <Link to="/admin/delete-club">Delete Club</Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-6">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">User List</h2>
            {loading ? (
              <p>Loading...</p>
            ) : users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="py-2 px-4 border-b">{user.id}</td>
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          <div className="p-6 text-center">
            <p className="mt-2 text-gray-600">
              Welcome, you are logged in with JWT!
            </p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
