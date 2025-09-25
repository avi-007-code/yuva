import { useState, useRef, useEffect } from "react";
import {
  IoNotificationsOutline,
  IoMoonOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [notifications] = useState([
    "New event added in Spoorthi 🎉",
    "Kruthi Club meeting tomorrow at 5 PM",
    "Prakruthi posted a new update 🌿",
    "SAHELI workshop registrations open 💡",
  ]);
  const [showPanel, setShowPanel] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  const panelRef = useRef(null);
  const bellRef = useRef(null);

  const navigate = useNavigate();

  const username = "Hemanth"; // dynamic later
  const firstLetter = username.charAt(0).toUpperCase();

  // ✅ Load clubs from localStorage
  const [joinedClubs, setJoinedClubs] = useState(() => {
    const saved = localStorage.getItem("joinedClubs");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ close notification on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setShowPanel(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
  };

  // 🎯 Club data
  const clubs = [
    {
      name: "Spoorthi",
      image: "https://lbrce.ac.in/clubs/spoorthi_club/images/spoorthi_logo.jpg",
      about:
        "Focuses on enhancing sociability, stress management, and fostering positive campus vibes through activities like debates, book reviews, creative writing, and puzzle-solving.",
      color: darkTheme ? "text-indigo-400" : "text-indigo-600",
    },
    {
      name: "Kruthi",
      image: "https://lbrce.ac.in/clubs/kruthi_club/images/kruthi_logo.jpg",
      about:
        "Provides an outlet for artistic expression in music, dance, and other fine arts, fostering imagination, confidence, and creative thinking through events and competitions.",
      color: darkTheme ? "text-green-400" : "text-green-600",
    },
    {
      name: "Prakruthi",
      image: "https://lbrce.ac.in/clubs/prakruthi_club/images/prakruthi_logo.png",
      about:
        "Promotes environmental awareness and sustainable practices through activities like tree planting, promoting eco-friendly alternatives, and recycling.",
      color: darkTheme ? "text-blue-400" : "text-blue-600",
    },
    {
      name: "SAHELI",
      image: "https://lbrce.ac.in/clubs/saheli_club/images/saheli_logo.jpg",
      about:
        "Aims to empower women through education, health awareness, vocational training, leadership development, entrepreneurship, and advocacy for women's rights.",
      color: darkTheme ? "text-pink-400" : "text-pink-600",
    },
  ];

  // ✅ Toggle club join/leave
  const handleToggleClub = (clubName) => {
    let updated;
    if (joinedClubs.includes(clubName)) {
      updated = joinedClubs.filter((c) => c !== clubName);
    } else {
      updated = [...joinedClubs, clubName];
    }
    setJoinedClubs(updated);
    localStorage.setItem("joinedClubs", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage")); // 🔥 notify profile
  };

  return (
    <div
      className={`flex flex-col w-full min-h-screen transition-colors duration-300 
        ${darkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
    >
      {/* 🔔 Top bar */}
      <div
        className={`flex items-center justify-between px-6 py-4 shadow-md relative 
        ${darkTheme ? "bg-gray-800" : "bg-indigo-600"}`}
      >
        <h1 className="text-xl font-bold text-white">User Dashboard</h1>

        <div className="flex items-center space-x-6 text-white">
          {/* Bell Icon + Dropdown */}
          <div ref={bellRef} className="relative">
            <IoNotificationsOutline
              className="text-2xl cursor-pointer"
              onClick={() => setShowPanel((prev) => !prev)}
            />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
            )}

            {showPanel && (
              <div
                ref={panelRef}
                className={`absolute right-0 top-12 w-72 shadow-lg rounded-lg border z-50
                ${
                  darkTheme
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200 text-black"
                }`}
              >
                <div className="p-3 border-b font-semibold">Notifications</div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((note, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-2 text-sm border-b last:border-none cursor-pointer 
                          ${
                            darkTheme
                              ? "hover:bg-gray-700 border-gray-700"
                              : "hover:bg-gray-100 border-gray-200"
                          }`}
                      >
                        {note}
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500">
                      No new notifications
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 🌙/☀️ Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-2xl cursor-pointer focus:outline-none"
          >
            {darkTheme ? <IoSunnyOutline /> : <IoMoonOutline />}
          </button>

          {/* 👤 Profile (First Letter) */}
          <button
            onClick={() => navigate("/userprofile")}
            className={`h-9 w-9 rounded-full cursor-pointer flex items-center justify-center font-bold text-lg 
              ${darkTheme ? "bg-gray-700 text-white" : "bg-white text-indigo-600"}`}
          >
            {firstLetter}
          </button>
        </div>
      </div>

      {/* 📌 Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <h2 className="mb-6 text-2xl font-semibold">Clubs</h2>

        {/* Club Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-[60%] max-w-4xl">
          {clubs.map((club, idx) => {
            const joined = joinedClubs.includes(club.name);

            return (
              <div
                key={idx}
                className={`rounded-xl shadow-md overflow-hidden transition hover:scale-105 
                  ${darkTheme ? "bg-gray-800" : "bg-white"}`}
              >
                {/* Club Image */}
                <div className="flex justify-center mt-4">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-24 h-24 rounded-full object-contain"
                  />
                </div>

                {/* Club Info */}
                <div className="p-4 flex flex-col items-center text-center">
                  <h3 className={`text-lg font-bold mb-2 ${club.color}`}>
                    {club.name}
                  </h3>
                  <p className="text-sm mb-4">{club.about}</p>

                  <button
                    onClick={() => handleToggleClub(club.name)}
                    className={`px-4 py-2 hover:cursor-pointer rounded-lg font-medium transition
                      ${
                        joined
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : darkTheme
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                  >
                    {joined ? "Leave Club" : "Join"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
