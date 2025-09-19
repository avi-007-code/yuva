// src/components/Header.jsx
import React from "react";

function Header() {
  return (
    <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Yuva</h1>
      <nav>
        <ul className="flex space-x-6">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="#about" className="hover:underline">About</a></li>
          <li><a href="/signin" className="hover:underline">Sign In</a></li>
          <li><a href="/signup" className="hover:underline">Sign Up</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
