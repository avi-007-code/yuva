import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

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
      // Convert to base64 so the image persists when saved to localStorage
      const reader = new FileReader();
      reader.onload = () => {
        setEditData({ ...editData, profileImg: reader.result });
      };
      reader.readAsDataURL(file);
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

  const { darkTheme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen w-full flex justify-center items-center p-6 transition-colors duration-300 ${darkTheme ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-100 via-white to-purple-100'}`}>
      <div className={`relative w-full max-w-2xl ${darkTheme ? 'bg-gray-800/60 text-white border-gray-700' : 'bg-white/60 border-white/40'} backdrop-blur-lg shadow-2xl rounded-3xl p-8 border transition-all duration-300`}>
        {/* 🔙 Back Arrow */}
        <button
          onClick={handleBack}
          className={`absolute top-5 left-5 cursor-pointer text-3xl transition-colors ${darkTheme ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
        >
          <IoArrowBack />
        </button>

        {/* 👤 Profile Image */}
        <div className="flex justify-center mt-6">
          <div
            className={`relative ${isEditing ? "cursor-pointer group" : ""}`}
            onClick={handleImageClick}
          >
            <img
              src={isEditing ? editData.profileImg : user.profileImg}
              alt="Profile"
              className={`w-45 h-45 rounded-full object-cover shadow-lg transition-transform duration-300 hover:scale-105 ${darkTheme ? 'border-gray-600' : 'border-white'}`}
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
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 text-xs group-hover:scale-110 transition">
                <FaPlus size={12} />
              </div>
            )}
          </div>
        </div>

        {/* 📝 Name */}
        <div className="text-center mt-6">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleChange}
              className={`text-3xl font-semibold text-center bg-transparent border-b-2 focus:outline-none focus:border-blue-500 ${darkTheme ? 'border-gray-600 text-white placeholder-gray-300' : 'border-gray-300 text-gray-800'}`}
            />
          ) : (
            <h1 className={`text-3xl font-bold ${darkTheme ? 'text-white' : 'text-gray-800'}`}>{user.name}</h1>
          )}
        </div>

        {/* 📧 Email (Hidden during edit mode) */}
        {!isEditing && (
          <p className={`text-center text-lg mt-1 ${darkTheme ? 'text-gray-300' : 'text-gray-500'}`}>{user.email}</p>
        )}

        {/* 🧾 Bio */}
        <div className="mt-6 text-center">
          {isEditing ? (
            <textarea
              name="bio"
              value={editData.bio}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkTheme ? 'bg-gray-700/70 text-white border-gray-600' : 'bg-white/70'}`}
            />
          ) : (
            <p className="text-lg italic leading-relaxed max-w-lg mx-auto">
              {user.bio}
            </p>
          )}
        </div>

        {/* 🏛️ Clubs (Hidden when editing) */}
        {!isEditing && (
          <div className="mt-8">
            <h2 className={`text-xl font-semibold text-center ${darkTheme ? 'text-gray-100' : 'text-gray-700'}`}>
              Joined Clubs
            </h2>
            {joinedClubs.length > 0 ? (
              <ul className="mt-3 flex flex-wrap justify-center gap-3">
                {joinedClubs.map((club, index) => (
                  <li
                    key={index}
                    className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm shadow-md"
                  >
                    {club}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`mt-3 text-sm text-center ${darkTheme ? 'text-gray-300' : 'text-gray-500'}`}>
                You haven’t joined any clubs yet.
              </p>
            )}
          </div>
        )}

        {/* 🔘 Buttons */}
        <div className="mt-10 flex justify-center gap-6">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:opacity-90 transition"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-3 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:opacity-90 transition"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
