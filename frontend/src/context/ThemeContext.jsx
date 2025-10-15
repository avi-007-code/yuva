import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
  darkTheme: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [darkTheme, setDarkTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("darkTheme");
      return stored ? JSON.parse(stored) : false;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("darkTheme", JSON.stringify(darkTheme));
    } catch (e) {
      // ignore
    }
  }, [darkTheme]);

  const toggleTheme = () => setDarkTheme((s) => !s);

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
