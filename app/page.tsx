// src/app/page.tsx
"use client";

import { useState } from "react";
import Background from "../components/Background";
import Hero from "../components/Hero";
import Experience from "../components/Experience";
import Architecture from "../components/Architecture";
import Contact from "../components/Contact";
import Scenery from "../components/Scenery";
import { Sun, Moon } from "lucide-react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden selection:bg-blue-500/30 transition-colors duration-1000">
      
      <Background isDarkMode={isDarkMode} />

      {/* Floating 8-Bit Theme Toggle Button - MOVED TO BOTTOM RIGHT */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-full border-[2px] transition-all duration-300 shadow-2xl flex items-center justify-center
            ${isDarkMode 
              ? 'bg-black/50 border-white/20 text-yellow-400 hover:bg-white/10 hover:border-yellow-400' 
              : 'bg-white/50 border-black/20 text-orange-500 hover:bg-white/80 hover:border-orange-500 backdrop-blur-md'}`}
        >
          {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </button>
      </div>

      <div className="relative z-10 flex flex-col">
        {/* Pass the state into ALL components */}
        <Hero isDarkMode={isDarkMode} />
        <Experience isDarkMode={isDarkMode} />
        <Architecture isDarkMode={isDarkMode} />
        <Contact isDarkMode={isDarkMode} />
        <Scenery isDarkMode={isDarkMode} />
      </div>

    </main>
  );
}