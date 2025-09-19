import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import Signup from "./pages/Signup";
import Signin from "./pages/SignIn";
import AdminDashboard from "./components/admin/adminDashboard";
import ViewUser from "./components/admin/ViewUser";
import ViewAllClubs from "./components/admin/ViewAllClubs";
import DeleteUser from "./components/admin/DeleteUser";
import DeleteClub from "./components/admin/DeleteClub";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/view-user" element={<ViewUser />} />
        <Route path="/admin/view-all-clubs" element={<ViewAllClubs />} />
        <Route path="/admin/delete-user" element={<DeleteUser />} />
        <Route path="/admin/delete-club" element={<DeleteClub />} />
      </Routes>
    </Router>
  );
}

export default App;
