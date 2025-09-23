import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  // Example user data (later you can fetch from backend)
  const user = {
    name: "Hemanth",
    email: "hemanth@gmail.com",
    joinedClubs: ["Spoorthi", "Prakruthi"],
    bio: "Tech enthusiast and active member of multiple clubs.",
  };
  const navigate=useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Profile Image */}
        <div className="flex justify-center">
          <img
            src="https://wallpapercave.com/wp/wp14706253.jpg"
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-500"
          />
        </div>

        {/* Name & Email */}
        <div className="text-center mt-4">
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Bio */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">{user.bio}</p>
        </div>

        {/* Clubs Joined */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Joined Clubs</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {user.joinedClubs.map((club, index) => (
              <li
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {club}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-around">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:cursor-pointer hover:bg-blue-600">
            Edit Profile
          </button>
          <button onClick={()=>navigate('/signin')} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:cursor-pointer shadow hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
