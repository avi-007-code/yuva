import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function Signup() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });

  const handleClick = () => setShow(!show);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User registered:", formData); // simulate API
    navigate("/signin");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col w-[30%] p-6 bg-white rounded-2xl shadow-lg">
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-center font-semibold text-2xl">Sign Up</h1>

          {/* ID */}
          <div className="flex flex-col">
            <label className="p-2 font-medium">Id</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="text-lg px-4 py-2 border rounded-lg border-gray-300"
              placeholder="Enter your Id"
            />
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <label className="p-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-lg px-4 py-2 border rounded-lg border-gray-300"
              placeholder="Enter your Name"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="p-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="text-lg px-4 py-2 border rounded-lg border-gray-300"
              placeholder="Enter your Email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="p-2 font-medium">Password</label>
            <input
              type={show ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="text-lg px-4 py-2 border rounded-lg border-gray-300"
              placeholder="Enter your Password"
            />
            <span
              onClick={handleClick}
              className="absolute right-4 top-[55%] cursor-pointer text-xl"
            >
              {show ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>

          {/* Submit */}
          <div className="flex flex-col mt-3">
            <button
              type="submit"
              className="bg-indigo-600 rounded-lg px-5 py-2 text-white font-medium hover:bg-indigo-500 transition"
            >
              Sign Up
            </button>
          </div>

          {/* Redirect link */}
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
