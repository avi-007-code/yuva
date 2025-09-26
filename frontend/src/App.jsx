import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/admin/adminDashboard";
import ViewUser from "./components/admin/ViewUser";
import ViewAllUsers from "./components/admin/ViewAllUsers";
import { useState } from 'react'
import Homepage from "./pages/Homepage";
import Signin from "./pages/SignIn";
import Signup from "./pages/Signup";
import ViewAllClubs from "./components/admin/ViewAllClubs";
import ViewClub from "./components/admin/ViewClub";
import DeleteClub from "./components/admin/DeleteClub";
import DeleteUser from "./components/admin/DeleteUser";


function App() {


  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/view-user" element={<ViewUser />} />
        <Route path="/admin/view-all-users" element={<ViewAllUsers />} />
        <Route path="/admin/view-club" element={<ViewClub />} />
        <Route path="/admin/view-all-clubs" element={<ViewAllClubs />} />
        <Route path="/admin/delete-club" element={<DeleteClub />} />
        <Route path="/admin/delete-user" element={<DeleteUser />} />
      </Routes>

    </Router>
  );
}

export default App;
