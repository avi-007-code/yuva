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

  // example: username to display first letter
  const username = "Hemanth"; // you can fetch this dynamically
  const firstLetter = username.charAt(0).toUpperCase();

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
                ${darkTheme ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-black"}`}
              >
                <div className="p-3 border-b font-semibold">Notifications</div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((note, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-2 text-sm border-b last:border-none cursor-pointer 
                          ${darkTheme ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-100 border-gray-200"}`}
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
          <button onClick={toggleTheme} className="text-2xl cursor-pointer focus:outline-none">
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
        <h2 className="mb-6 text-2xl font-semibold">Choose Your Club</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
          <button
            className={`rounded-xl cursor-pointer shadow-md px-6 py-4 text-lg font-medium transition hover:scale-105 
              ${
                darkTheme
                  ? "bg-gray-800 text-indigo-400 hover:bg-gray-700"
                  : "bg-white text-indigo-600 hover:bg-indigo-50"
              }`}
          >
            Spoorthi
          </button>
          <button
            className={`rounded-xl cursor-pointer shadow-md px-6 py-4 text-lg font-medium transition hover:scale-105 
              ${
                darkTheme
                  ? "bg-gray-800 text-green-400 hover:bg-gray-700"
                  : "bg-white text-green-600 hover:bg-green-50"
              }`}
          >
            Kruthi
          </button>
          <button
            className={`rounded-xl cursor-pointer shadow-md px-6 py-4 text-lg font-medium transition hover:scale-105 
              ${
                darkTheme
                  ? "bg-gray-800 text-blue-400 hover:bg-gray-700"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
          >
            Prakruthi
          </button>
          <button
            className={`rounded-xl cursor-pointer shadow-md px-6 py-4 text-lg font-medium transition hover:scale-105 
              ${
                darkTheme
                  ? "bg-gray-800 text-pink-400 hover:bg-gray-700"
                  : "bg-white text-pink-600 hover:bg-pink-50"
              }`}
          >
            SAHELI
          </button>
        </div>
      </div>
    </div>
  );
}
