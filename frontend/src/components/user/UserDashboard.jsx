import { useState, useRef, useEffect } from "react";
import {
  IoNotificationsOutline,
  IoPersonCircleOutline,
  IoEllipsisVertical,
} from "react-icons/io5";

export default function UserDashboard () {
  const [notifications] = useState([
    "New event added in Spoorthi 🎉",
    "Kruthi Club meeting tomorrow at 5 PM",
    "Prakruthi posted a new update 🌿",
    "SAHELI workshop registrations open 💡",
  ]);
  const [showPanel, setShowPanel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const panelRef = useRef(null);
  const bellRef = useRef(null);
  const menuRef = useRef(null);
  const dotsRef = useRef(null);

  // ✅ independent close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      // Close notification if clicked outside
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setShowPanel(false);
      }

      // Close menu if clicked outside
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        dotsRef.current &&
        !dotsRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      {/* 🔔 Top bar */}
      <div className="flex items-center justify-between bg-indigo-600 px-6 py-4 shadow-md relative">
        <h1 className="text-xl font-bold text-white">User Dashboard</h1>

        <div className="flex items-center space-x-6 text-white relative">
          {/* Bell Icon */}
          <div
            ref={bellRef}
            className="relative cursor-pointer"
            onClick={() => setShowPanel((prev) => !prev)}
          >
            <IoNotificationsOutline className="text-2xl" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </div>

          {/* Notification dropdown */}
          {showPanel && (
            <div
              ref={panelRef}
              className="absolute right-12 top-12 w-72 bg-white text-black shadow-lg rounded-lg border border-gray-200 z-50"
            >
              <div className="p-3 border-b font-semibold text-gray-700">
                Notifications
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((note, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                    >
                      {note}
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-gray-500 text-sm">
                    No new notifications
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Three Dots Menu */}
          <div
            ref={dotsRef}
            className="cursor-pointer"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <IoEllipsisVertical className="text-2xl" />
          </div>

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 top-12 w-40 bg-white text-black shadow-lg rounded-lg border border-gray-200 z-50"
            >
              <ul className="flex flex-col text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                  <IoPersonCircleOutline className="text-lg" /> My Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Settings
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 📌 Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">
          Choose Your Club
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
          <button className="rounded-xl bg-white hover:cursor-pointer shadow-md px-6 py-4 text-lg font-medium text-indigo-600 hover:scale-105 hover:bg-indigo-50 transition">
            Spoorthi
          </button>
          <button className="rounded-xl bg-white hover:cursor-pointer shadow-md px-6 py-4 text-lg font-medium text-green-600 hover:scale-105 hover:bg-green-50 transition">
            Kruthi
          </button>
          <button className="rounded-xl bg-white hover:cursor-pointer shadow-md px-6 py-4 text-lg font-medium text-blue-600 hover:scale-105 hover:bg-blue-50 transition">
            Prakruthi
          </button>
          <button className="rounded-xl bg-white hover:cursor-pointer shadow-md px-6 py-4 text-lg font-medium text-pink-600 hover:scale-105 hover:bg-pink-50 transition">
            SAHELI
          </button>
        </div>
      </div>
    </div>
  );
}