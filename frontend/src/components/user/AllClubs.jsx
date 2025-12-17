import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { ThemeContext } from "../../context/ThemeContext";

export default function AllClubs() {
  const { darkTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

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

  const [joinedClubs, setJoinedClubs] = useState(
    JSON.parse(localStorage.getItem("joinedClubs")) || []
  );

  const toggleClub = (name) => {
    const updated = joinedClubs.includes(name)
      ? joinedClubs.filter((c) => c !== name)
      : [...joinedClubs, name];

    setJoinedClubs(updated);
    localStorage.setItem("joinedClubs", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

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

        <h1 className="text-3xl font-bold">All Clubs</h1>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-8xl ml-10 mx-auto">
        {clubs.map((club) => {
          const joined = joinedClubs.includes(club.name);

          return (
            <div
              key={club.name}
              className={`rounded-2xl shadow-lg p-8 transition transform hover:-translate-y-1 ${
                darkTheme ? "bg-gray-800" : "bg-white"
              }`}
            >
              <img
                src={club.image}
                className="w-24 h-24 mx-auto rounded-full"
              />

              <h2
                className={`text-center mt-4 font-bold text-lg ${club.color}`}
              >
                {club.name}
              </h2>

              <p className="text-sm text-center mt-2 opacity-80">
                {club.about}
              </p>

              <button
                onClick={() => toggleClub(club.name)}
                className={`mt-6 w-full cursor-pointer py-2 rounded-lg font-medium transition ${
                  joined
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {joined ? "Leave Club" : "Join Club"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
