import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { ThemeContext } from "../../context/ThemeContext";

export default function AllAnnouncements() {
  const { darkTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const announcements = [
    { club: "Spoorthi", msg: "Spoorthi Fest coming soon 🎭" },
    { club: "Kruthi", msg: "Dance workshop starts next week 💃" },
    { club: "Prakruthi", msg: "Green campus drive 🌱" },
    { club: "SAHELI", msg: "Self-defense training 🛡️" },
  ];

  return (
    <div
      className={`min-h-screen px-6 py-8 ${
        darkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate("/userdashboard")}
          className={`p-2 rounded-full cursor-pointer transition ${
            darkTheme
              ? "hover:bg-gray-800"
              : "hover:bg-gray-200"
          }`}
        >
          <IoArrowBackOutline className="text-2xl" />
        </button>

        <h1 className="text-3xl font-bold">All Announcements</h1>
      </div>

      {/* Announcements */}
      <div className="max-w-3xl ml-10 mx-auto flex flex-col gap-6">
        {announcements.map((a, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-lg border-l-4 transition ${
              darkTheme
                ? "bg-gray-800 border-indigo-400"
                : "bg-white border-indigo-600"
            }`}
          >
            <span
              className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                darkTheme
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {a.club}
            </span>

            <p className="text-sm mt-3 opacity-90">{a.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
