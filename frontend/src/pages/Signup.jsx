import React from "react";

function Signup() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Signup</h2>
      <form className="flex flex-col gap-3">
        <input type="text" placeholder="Name" className="border rounded p-2" />
        <input type="email" placeholder="Email" className="border rounded p-2" />
        <input type="password" placeholder="Password" className="border rounded p-2" />
        <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
