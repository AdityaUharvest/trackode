'use client';
import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme') as Theme;
    // Check system preference
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    // Set the theme based on localStorage or system preference
    const initialTheme = savedTheme || systemPreference;
    setTheme(initialTheme);
    document.body.className = initialTheme;
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem('theme', newTheme);
      document.body.className = newTheme;
      return newTheme;
    });
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider. Wrap your app with <ThemeProvider> to fix this.");
  }
  return context;
};