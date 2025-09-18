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
        const res = await fetch("http://localhost:3000/api/admin/verifyAdmin", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setIsAuth(true);
        } else {
          localStorage.removeItem("token");
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuth === null) return <div>Loading...</div>; // wait until check is done

  return isAuth ? children : <Navigate to="/signin" replace />;
}

export default ProtectedRoute;
