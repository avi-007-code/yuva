// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 p-4 text-center">
      <p>&copy; {new Date().getFullYear()} College Clubs. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
