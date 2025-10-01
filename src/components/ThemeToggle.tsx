// "use client";

// import { useState, useEffect } from "react";
// import { FaSun, FaMoon } from "react-icons/fa";

// const ThemeToggle = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     // Check for saved theme preference or use system preference
//     const savedTheme = localStorage.getItem("theme");
//     const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
//     const isDark = savedTheme ? savedTheme === "dark" : systemPrefersDark;
//     setDarkMode(isDark);
    
//     if (isDark) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newDarkMode = !darkMode;
//     setDarkMode(newDarkMode);
    
//     if (newDarkMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
    
//     // Dispatch event for other components to listen to
//     window.dispatchEvent(new Event("themeChanged"));
//   };

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none"
//       aria-label="Toggle theme"
//     >
//       {darkMode ? (
//         <FaSun className="text-yellow-400" size={16} />
//       ) : (
//         <FaMoon className="text-gray-600" size={16} />
//       )}
//     </button>
//   );
// };

// export default ThemeToggle;