import React, { useState, useEffect } from "react";
import { Sun, Moon, Search } from "lucide-react";

const Topbar = ({ onNewIssue }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkTheme(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all duration-200" 
          type="button"
          onClick={toggleTheme}
          title={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-slate-900/10 transition-all duration-200 hover:scale-105 active:scale-95" 
          type="button" 
          onClick={onNewIssue}
        >
          {/* <iconify-icon icon="solar:add-circle-linear" width="20" height="20"></iconify-icon> */}
          {/* Using a simple plus char or lucide icon if available, but staying consistent with icon usage */}
          <span className="text-xl leading-none">+</span>
          Create Task
        </button>
      </div>
    </header>
  );
};

export default Topbar;
