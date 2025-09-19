import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token in header
          },
        });

        setIsAuth(res.ok);
      } catch (err) {
        console.error("Token verification error", err);
        setIsAuth(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuth === null) return <div>Checking authentication...</div>;

  return isAuth ? children : <Navigate to="/signin" replace />;
}

export default ProtectedRoute;
