import { useState, useRef, useEffect, useContext } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { darkTheme, toggleTheme } = useContext(ThemeContext);

  /* ================= USER ================= */
  const username = "Hemanth";
  const firstLetter = username.charAt(0).toUpperCase();

  /* ================= PROFILE IMAGE ================= */
  const [profileImg, setProfileImg] = useState(() => {
    try {
      const saved = localStorage.getItem("userProfile");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed.profileImg || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "userProfile") {
        try {
          const parsed = JSON.parse(e.newValue || "null");
          setProfileImg(parsed ? parsed.profileImg : null);
        } catch {
          setProfileImg(null);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ================= PROFILE MENU ================= */
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
  function handleClickOutside(e) {
    if (
      avatarRef.current &&
      !avatarRef.current.contains(e.target) &&
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setShowAvatarMenu(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  /* ================= DATA ================= */
  const allAnnouncements = [
    { club: "Spoorthi", msg: "Spoorthi Fest coming soon! 🎭" },
    { club: "Kruthi", msg: "Dance workshop starts Monday 💃" },
    { club: "Prakruthi", msg: "Green campus drive this Friday 🌱" },
    { club: "SAHELI", msg: "Self-defense training 🛡️" },
  ];

  const clubs = [
    {
      name: "Spoorthi",
      image: "https://lbrce.ac.in/clubs/spoorthi_club/images/spoorthi_logo.jpg",
      about: "Enhances sociability and campus vibes.",
      color: "text-indigo-500",
    },
    {
      name: "Kruthi",
      image: "https://lbrce.ac.in/clubs/kruthi_club/images/kruthi_logo.jpg",
      about: "Music, dance & fine arts.",
      color: "text-green-500",
    },
    {
      name: "Prakruthi",
      image: "https://lbrce.ac.in/clubs/prakruthi_club/images/prakruthi_logo.png",
      about: "Environmental awareness & sustainability.",
      color: "text-blue-500",
    },
    {
      name: "SAHELI",
      image: "https://lbrce.ac.in/clubs/saheli_club/images/saheli_logo.jpg",
      about: "Women empowerment & leadership.",
      color: "text-pink-500",
    },
  ];

  /* ================= JOINED CLUBS ================= */
  const [joinedClubs, setJoinedClubs] = useState(
    JSON.parse(localStorage.getItem("joinedClubs")) || []
  );

  const joinedClubDetails = clubs.filter((c) =>
    joinedClubs.includes(c.name)
  );

  const joinedAnnouncements = allAnnouncements.filter((a) =>
    joinedClubs.includes(a.club)
  );

  /* ================= UI ================= */
  return (
    <div
      className={`min-h-screen transition-colors ${
        darkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* ================= TOP BAR ================= */}
      <div
        className={`flex items-center justify-between px-6 py-4 shadow ${
          darkTheme ? "bg-gray-800" : "bg-indigo-600"
        }`}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">User Dashboard</h1>

          <button
            onClick={() => navigate("/allclubs")}
            className="px-4 py-1 cursor-pointer ml-2 rounded bg-white/20 text-white hover:bg-white/30"
          >
            Clubs
          </button>

          <button
            onClick={() => navigate("/allannouncements")}
            className="px-3 py-1 rounded cursor-pointer bg-white/20 text-white hover:bg-white/30"
          >
            Announcements
          </button>
        </div>

        <div className="flex items-center gap-5 text-white">
          <button onClick={toggleTheme} className="text-2xl cursor-pointer">
            {darkTheme ? <IoSunnyOutline /> : <IoMoonOutline />}
          </button>

          {/* ================= PROFILE ================= */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setShowAvatarMenu((prev) => !prev)}
              className="h-10 w-10 cursor-pointer rounded-full bg-white flex items-center justify-center font-bold text-indigo-600 overflow-hidden"
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                firstLetter
              )}
            </button>


            {showAvatarMenu && (
              <div
                ref={menuRef}
                className={`absolute right-0 mt-2 w-44 rounded shadow z-50 ${
                  darkTheme
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black"
                }`}
              >
                <button
                  onClick={() => navigate("/userprofile")}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 w-full hover:bg-gray-700/20"
                >
                  <FaUserCircle />
                  My Profile
                </button>

                <button
                  onClick={() => navigate("/signin")}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 w-full text-red-500 hover:bg-red-500/10"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6 space-y-10">
        {/* My Clubs */}
        <div>
          <h2 className="text-3xl font-bold mb-5">My Clubs</h2>

          {joinedClubDetails.length === 0 ? (
            <p className="opacity-70">You haven’t joined any clubs yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 max-w-6xl">
              {joinedClubDetails.map((club) => (
                <div
                  key={club.name}
                  className={`rounded-xl p-10 shadow ${
                    darkTheme ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <img
                    src={club.image}
                    className="w-20 h-20 mx-auto rounded-full"
                  />
                  <h3
                    className={`text-center mt-3 font-bold ${club.color}`}
                  >
                    {club.name}
                  </h3>
                  <p className="text-sm text-center mt-2">
                    {club.about}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div>
          <h2 className="text-3xl font-bold mb-5">
            Club Announcements
          </h2>

          {joinedAnnouncements.length === 0 ? (
            <p className="opacity-70">No announcements available.</p>
          ) : (
            <div className="flex flex-col gap-4 max-w-3xl">
              {joinedAnnouncements.map((a, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${
                    darkTheme
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h4 className="font-semibold">{a.club}</h4>
                  <p className="text-sm mt-1">{a.msg}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
