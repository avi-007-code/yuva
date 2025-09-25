import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token); // ✅ store token
        navigate("/dashboard"); // redirect
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col w-[30%] p-8 bg-white rounded-2xl shadow-lg">
        <form className="flex flex-col space-y-5" onSubmit={handleSignin}>
          <h1 className="text-center font-semibold text-2xl">Login</h1>

          {/* Email */}
          <div className="flex flex-col">
            <label className="p-2 font-medium">Email</label>
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

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="p-2 font-medium">Password</label>
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
              className="absolute right-4 top-[55%] cursor-pointer text-xl"
            >
              {show ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-indigo-600 rounded-lg px-3 py-2 text-white font-medium hover:bg-indigo-500 transition"
          >
            Login
          </button>

          {/* Reset password link */}
          <div className="flex p-2 justify-between text-sm">
            <span className="text-gray-600">Forgot Password?</span>
            <button
              type="button"
              className="text-blue-700 hover:underline hover:cursor-pointer"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
