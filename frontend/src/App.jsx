import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/SignIn";
// import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/admin/adminDashboard";
import UserDashboard from "./components/user/UserDashboard";
import UserProfile from "./components/user/UserProfile";
import ThemeProvider from "./context/ThemeContext";
import AllClubs from "./components/user/AllClubs";
import AllAnnouncements from "./components/user/AllAnnouncements";

function App() {

  const hideNavbarRoutes=["/userdashboard","/userprofile","/dashboard"]
  
  return (
    <ThemeProvider>
      <Router>
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/userdashboard"  element={<UserDashboard />}/>
          <Route path="/userprofile" element={<UserProfile />}/>
          <Route path="/allclubs" element={<AllClubs />} />
          <Route path="/allannouncements" element={<AllAnnouncements />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
