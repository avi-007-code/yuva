import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

export default function UserProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ✅ Load user info from localStorage or defaults
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userProfile");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "Hemanth",
          email: "hemanth@gmail.com",
          bio: "Tech enthusiast and active member of multiple clubs.",
          profileImg: "https://wallpapercave.com/wp/wp14706253.jpg",
        };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);
  const [joinedClubs, setJoinedClubs] = useState(() => {
    const saved = localStorage.getItem("joinedClubs");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Sync clubs across tabs
  useEffect(() => {
    function syncClubs() {
      const saved = localStorage.getItem("joinedClubs");
      setJoinedClubs(saved ? JSON.parse(saved) : []);
    }
    window.addEventListener("storage", syncClubs);
    return () => window.removeEventListener("storage", syncClubs);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setEditData({ ...editData, profileImg: imgUrl });
    }
  };

  const handleSave = () => {
    setUser(editData);
    setIsEditing(false);
    localStorage.setItem("userProfile", JSON.stringify(editData));
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditData(user);
    } else {
      navigate("/userdashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md relative">
        {/* 🔙 Back Arrow */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-gray-600 hover:text-blue-600 text-2xl cursor-pointer"
        >
          <IoArrowBack />
        </button>

        {/* 👤 Profile Image */}
        <div className="flex justify-center">
          <div
            className={`relative ${isEditing ? "cursor-pointer group" : ""}`}
            onClick={handleImageClick}
          >
            <img
              src={isEditing ? editData.profileImg : user.profileImg}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover transition hover:opacity-80"
            />

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {/* '+' Overlay when editing */}
            {isEditing && (
              <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-2 text-xs group-hover:scale-110 transition">
                <FaPlus size={10} />
              </div>
            )}
          </div>
        </div>

        {/* 📝 Name */}
        <div className="text-center mt-4">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleChange}
              className="text-2xl font-bold text-center border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          )}
        </div>

        {/* 📧 Email (Hidden during edit mode) */}
        {!isEditing && (
          <p className="text-center text-gray-500">{user.email}</p>
        )}

        {/* 🧾 Bio (Editable only in edit mode) */}
        <div className="mt-4 text-center">
          {isEditing ? (
            <textarea
              name="bio"
              value={editData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="text-gray-600">{user.bio}</p>
          )}
        </div>

        {/* 🏛️ Clubs (Hidden when editing) */}
        {!isEditing && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700">Joined Clubs</h2>
            {joinedClubs.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {joinedClubs.map((club, index) => (
                  <li
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {club}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-500 text-sm">
                You haven’t joined any clubs yet.
              </p>
            )}
          </div>
        )}

        {/* 🔘 Buttons */}
        <div className="mt-6 flex justify-around">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 cursor-pointer"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
