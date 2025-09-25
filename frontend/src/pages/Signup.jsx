import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setShow(!show);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ 1. Empty field check
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    // ✅ 2. Name should only have alphabets + spaces
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      alert("Name must contain only alphabets");
      return;
    }

    // ✅ 3. Email must end with @gmail.com
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      alert("Email must be a valid Gmail address (e.g., example@gmail.com)");
      return;
    }

    // ✅ 4. Password length validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Admin registered successfully");
        navigate("/signin");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register error", err);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col w-[30%] p-6 bg-gray-50 rounded-2xl shadow-lg">
        <form className="flex flex-col space-y-3" onSubmit={handleSignup}>
          <h1 className="text-center font-semibold text-2xl">SignUp</h1>

          <div className="flex flex-col">
            <label className="flex p-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg px-4 py-2 border rounded-lg border-gray-300"
              placeholder="Enter your Name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="flex p-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-lg px-4 py-2 border rounded-lg border-gray-300"
              placeholder="Enter your Email"
              required
            />
          </div>

          <div className="flex flex-col relative">
            <label className="flex p-2 font-medium">Password</label>
            <input
              type={show ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg px-4 py-2 border rounded-lg border-gray-300"
              placeholder="Enter Your Password"
              required
            />
            <span
              onClick={handleClick}
              className="absolute right-4 top-[60%] text-xl cursor-pointer"
            >
              {show ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>

          <div className="flex flex-col mt-3">
            <button
              type="submit"
              className="bg-indigo-600 rounded-lg px-5 py-2 text-white font-medium hover:bg-indigo-500 transition"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
