import React, { useState } from "react";
import axios from "axios";

const DeleteClub = () => {
  const [clubId, setClubId] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:${import.meta.env.VITE_API_PORT}/api/admin/deleteClub/${clubId}`
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete club");
    }
  };

  return (
    <div>
      <h1>Delete Club</h1>
      <input
        type="text"
        placeholder="Enter Club ID"
        value={clubId}
        onChange={(e) => setClubId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteClub;