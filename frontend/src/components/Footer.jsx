// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex justify-between">
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              </li>
              <li>
                <Link to="/signin" className="hover:underline">Sign In</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:underline">Sign Up</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p>Email: support@yuva.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <p>&copy; 2025 Yuva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
