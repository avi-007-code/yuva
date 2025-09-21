import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/signin");
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="mt-2 text-gray-600">This is your private dashboard.</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
