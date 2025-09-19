import React, { useState } from "react";
import axios from "axios";

const DeleteUser = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:${import.meta.env.VITE_API_PORT}/api/admin/deleteUser/${userId}`
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete user");
    }
  };

  return (
    <div>
      <h1>Delete User</h1>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteUser;