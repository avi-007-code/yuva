import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtDecodeImport from 'jwt-decode';

// Safely handle default/named import variations of jwt-decode across different bundlers/versions
const jwtDecode = typeof jwtDecodeImport === 'function' ? jwtDecodeImport : jwtDecodeImport.jwtDecode;

const AuthContext = createContext(null);

const getStoredToken = () => {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('adminToken') ||
    localStorage.getItem('managerToken') ||
    null
  );
};

const parseAndValidateToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // Check expiration if exp field exists (in seconds)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return {
      userId: decoded.userId || decoded.id,
      role: decoded.role,
      clubId: decoded.clubId || undefined,
      email: decoded.email,
      ...decoded,
    };
  } catch (err) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => {
    const initialToken = getStoredToken();
    const parsedUser = parseAndValidateToken(initialToken);
    if (initialToken && !parsedUser) {
      // Token exists but is invalid or expired -> clean up
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('managerToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('managerUser');
    }
    return parsedUser;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      const validUser = parseAndValidateToken(storedToken);
      if (!validUser) {
        logout();
      } else {
        setUser(validUser);
      }
    }
  }, []);

  const login = (newToken, userData = null) => {
    if (!newToken) return;
    const decodedUser = parseAndValidateToken(newToken);
    if (!decodedUser) {
      logout();
      return;
    }
    const mergedUser = {
      ...decodedUser,
      ...(userData || {}),
      name: userData?.name || decodedUser.name,
    };
    localStorage.setItem('token', newToken);
    if (userData) {
      const userKey = decodedUser.role === 'ADMIN' ? 'adminUser' : 'managerUser';
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
    // Sync with existing token keys for backward compatibility with existing API utilities
    if (decodedUser.role === 'ADMIN') {
      localStorage.setItem('adminToken', newToken);
    } else {
      localStorage.setItem('managerToken', newToken);
    }
    setToken(newToken);
    setUser(mergedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('managerToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('managerUser');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        token,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

