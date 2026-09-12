import React from "react";
import { Users, ClipboardList, Trash2, Building2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear session
    navigate("/signin"); // Redirect to login
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={fadeIn}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-blue-700 text-white py-5 px-8 shadow-lg flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold tracking-wide">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </motion.header>

      <div className="flex flex-1">
        
        {/* Sidebar */}
        <motion.nav
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-72 bg-white shadow-xl border-r p-6 space-y-6"
        >
          <div className="text-gray-700 font-semibold text-lg mb-3">Navigation</div>
          <ul className="space-y-4 text-gray-600">
            <li className="hover:text-blue-600 transition flex items-center gap-2">
              <Users className="w-5 h-5" />
              <a href="/admin/view-all-users">View Users</a>
            </li>
            <li className="hover:text-blue-600 transition flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <a href="/admin/view-all-clubs">View All Clubs</a>
            </li>
            <li className="hover:text-blue-600 transition flex items-center gap-2">
              <ChevronRight className="w-5 h-5" />
              <a href="/admin/view-club">View A Club</a>
            </li>
            <li className="hover:text-blue-600 transition flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <a href="/admin/delete-user">Delete User</a>
            </li>
            <li className="hover:text-blue-600 transition flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <a href="/admin/delete-club">Delete Club</a>
            </li>
          </ul>
        </motion.nav>

        {/* Main content */}
        <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
          
          {/* Statistics */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">Statistics Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Animated Cards */}
              <motion.div 
                whileHover={{ scale: 1.04 }} 
                className="bg-white p-6 rounded-2xl shadow-md border cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
                    <p className="text-4xl font-bold text-blue-700">100</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.04 }} 
                className="bg-white p-6 rounded-2xl shadow-md border cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Posts</h3>
                    <p className="text-4xl font-bold text-blue-700">50</p>
                  </div>
                  <ClipboardList className="w-10 h-10 text-blue-600" />
                </div>
              </motion.div>

            </div>
          </section>

          {/* Tools */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Management Tools</h2>

            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl shadow-md"
              >
                Add User
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl shadow-md"
              >
                Manage Posts
              </motion.button>
            </div>
          </section>
        </main>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
