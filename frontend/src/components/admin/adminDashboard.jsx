import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <div className="flex">
        <nav className="w-1/4 bg-white shadow-md p-4">
          <ul className="space-y-4">
            <li className="text-blue-600 font-semibold">Home</li>
            <li className="text-gray-700">Users</li>
            <li className="text-gray-700">Settings</li>
          </ul>
        </nav>
        <main className="flex-1 p-6">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 shadow rounded">
                <h3 className="text-lg font-medium">Users</h3>
                <p className="text-2xl font-bold">100</p>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <h3 className="text-lg font-medium">Posts</h3>
                <p className="text-2xl font-bold">50</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Management Tools</h2>
            <div className="space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">Add User</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">Manage Posts</button>
            </div>
          </section>
          <div className="p-6 text-center">
            <p className="mt-2 text-gray-600">Welcome, you are logged in with JWT!</p>
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