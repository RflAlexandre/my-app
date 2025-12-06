import React, { createContext, useContext, useState } from 'react';
import { colorPalettes, defaultTheme } from './colors';

const ThemeContext = createContext({
  theme: defaultTheme,
  toggleTheme: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('urban');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === 'urban' ? 'premium' : 'urban');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: colorPalettes[currentTheme],
        toggleTheme,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);