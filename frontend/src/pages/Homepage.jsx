// src/pages/Homepage.jsx
import React from "react";
import Layout from "../components/Layout";

function Homepage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-4 py-12">
        <h2 className="text-4xl font-bold mb-4">Welcome to College Clubs!</h2>
        <p className="mb-6 text-gray-600 max-w-lg">
          Join clubs, participate in events, and connect with like-minded students. 
          Discover opportunities to showcase your skills and grow your network.
        </p>

        <div className="space-x-4">
          <a href="/signin">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition">
              Sign In
            </button>
          </a>
          <a href="/signup">
            <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
              Sign Up
            </button>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-100 text-center px-6">
        <h3 className="text-3xl font-semibold mb-4">About Us</h3>
        <p className="text-gray-700 max-w-2xl mx-auto">
          We are a student-driven platform that brings together all college clubs 
          under one roof. Our mission is to make it easier for students to 
          explore, join, and participate in club activities and events.
        </p>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 text-center px-6">
        <h3 className="text-3xl font-semibold mb-4">Meet the Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 border rounded-lg shadow-md">
            <h4 className="font-bold text-lg">Avinash</h4>
            <p className="text-gray-600">Project Lead</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h4 className="font-bold text-lg">Teammate 1</h4>
            <p className="text-gray-600">Frontend Developer</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h4 className="font-bold text-lg">Teammate 2</h4>
            <p className="text-gray-600">Backend Developer</p>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="py-16 bg-gray-100 text-center px-6">
        <h3 className="text-3xl font-semibold mb-4">Connect With Us</h3>
        <p className="text-gray-700 mb-6">
          Have questions or want to collaborate? Reach out to us!
        </p>
        <form className="max-w-lg mx-auto flex flex-col space-y-4">
          <input 
            type="text" 
            placeholder="Your Name" 
            className="border rounded-lg p-2 w-full"
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            className="border rounded-lg p-2 w-full"
          />
          <textarea 
            placeholder="Your Message" 
            className="border rounded-lg p-2 w-full"
            rows="4"
          ></textarea>
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Send Message
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default Homepage;
