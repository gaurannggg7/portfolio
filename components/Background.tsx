// src/components/Background.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Background({ isDarkMode }: { isDarkMode: boolean }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; delay: number; duration: number }[]>([]);

  const springConfig = { damping: 50, stiffness: 100, mass: 3 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const x1 = useTransform(smoothX, (v) => v * 0.8);
  const y1 = useTransform(smoothY, (v) => v * 0.8);
  const x2 = useTransform(smoothX, (v) => v * -0.5); 
  const y2 = useTransform(smoothY, (v) => v * -0.5);
  const x3 = useTransform(smoothX, (v) => v * 0.15);
  const y3 = useTransform(smoothY, (v) => v * 0.15);

  useEffect(() => {
    const generatedStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generatedStars);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // ----------------------------------------------------------------
  // DAYTIME RENDER (Light Mode)
  // ----------------------------------------------------------------
  if (!isDarkMode) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-b from-[#2563EB] to-[#7DD3FC] transition-colors duration-1000">
        
        {/* The 8-Bit Blocky Sun */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 opacity-90 shadow-[0_0_60px_rgba(250,204,21,0.6)]" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }} />

        {/* --- 8-Bit Clouds (Parallax Scrolling) --- */}
        <motion.div className="absolute top-[15%] w-[120px] opacity-80" animate={{ x: ["100vw", "-20vw"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
          <svg viewBox="0 0 100 40" fill="white" shapeRendering="crispEdges">
            <path d="M20 20 L20 10 L40 10 L40 0 L70 0 L70 10 L90 10 L90 30 L10 30 L10 20 Z" />
          </svg>
        </motion.div>

        <motion.div className="absolute top-[35%] w-[180px] opacity-60" animate={{ x: ["100vw", "-30vw"] }} transition={{ duration: 65, repeat: Infinity, ease: "linear", delay: 5 }}>
          <svg viewBox="0 0 100 40" fill="white" shapeRendering="crispEdges">
            <path d="M30 20 L30 10 L50 10 L50 0 L80 0 L80 10 L95 10 L95 30 L15 30 L15 20 Z" />
          </svg>
        </motion.div>

        {/* --- The Maroon & Gold ASU Blimp --- */}
        <motion.div className="absolute top-[25%] z-10 w-[200px]" animate={{ x: ["-20vw", "110vw"], y: [0, -15, 0] }} transition={{ x: { duration: 90, repeat: Infinity, ease: "linear" }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}>
          <svg viewBox="0 0 140 60" shapeRendering="crispEdges" className="drop-shadow-xl">
            <rect x="20" y="10" width="100" height="30" fill="#8C1D40" rx="10" />
            <rect x="10" y="15" width="10" height="20" fill="#8C1D40" />
            <rect x="5" y="5" width="10" height="10" fill="#8C1D40" />
            <rect x="5" y="35" width="10" height="10" fill="#8C1D40" />
            <rect x="55" y="40" width="30" height="10" fill="#FFC627" />
            <text x="48" y="32" fill="#FFC627" fontFamily="monospace" fontWeight="900" fontSize="22" letterSpacing="2">ASU</text>
          </svg>
        </motion.div>

        {/* --- The 8-Bit Airplane --- */}
        <motion.div className="absolute top-[45%] w-[60px]" animate={{ x: ["110vw", "-10vw"] }} transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 10 }}>
          <svg viewBox="0 0 60 30" shapeRendering="crispEdges" className="drop-shadow-md">
            <rect x="10" y="10" width="40" height="10" fill="#f4f4f5" />
            <rect x="40" y="0" width="10" height="10" fill="#d4d4d8" /> 
            <rect x="20" y="20" width="20" height="5" fill="#a1a1aa" /> 
            <rect x="0" y="10" width="10" height="10" fill="#38bdf8" /> 
          </svg>
        </motion.div>

        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // NIGHTTIME RENDER (Dark Mode / Original + New Additions)
  // ----------------------------------------------------------------
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#020202] transition-colors duration-1000">
      
      {/* Background Twinkling Stars */}
      <div className="absolute inset-0 z-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          />
        ))}
      </div>

      {/* --- NEW: The 8-Bit Pixel Moon --- */}
      <div className="absolute top-16 right-[15%] w-24 h-24 bg-zinc-200 opacity-90 shadow-[0_0_60px_rgba(255,255,255,0.3)]" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
        {/* Moon Craters */}
        <div className="absolute top-4 left-6 w-4 h-4 bg-zinc-400/80" />
        <div className="absolute bottom-6 right-6 w-6 h-4 bg-zinc-400/80" />
        <div className="absolute top-10 right-4 w-2 h-2 bg-zinc-400/80" />
        <div className="absolute bottom-10 left-4 w-3 h-3 bg-zinc-400/80" />
      </div>

      {/* --- NEW: The Slow-Moving Satellite --- */}
      <motion.div className="absolute top-[20%] w-[80px] opacity-70" animate={{ x: ["110vw", "-10vw"], y: [0, 15, 0] }} transition={{ x: {duration: 80, repeat: Infinity, ease: "linear"}, y: {duration: 8, repeat: Infinity, ease: "easeInOut"} }}>
          <svg viewBox="0 0 80 40" shapeRendering="crispEdges">
            {/* Solar Panels */}
            <rect x="0" y="10" width="25" height="20" fill="#0284c7" />
            <rect x="55" y="10" width="25" height="20" fill="#0284c7" />
            {/* Connector & Body */}
            <rect x="25" y="18" width="30" height="4" fill="#52525b" />
            <rect x="35" y="12" width="10" height="16" fill="#a1a1aa" />
            {/* Antenna */}
            <rect x="38" y="4" width="4" height="8" fill="#71717a" />
            <rect x="36" y="2" width="8" height="2" fill="#ef4444" className="animate-pulse" /> {/* Blinking Red Light */}
          </svg>
      </motion.div>

      {/* --- NEW: The Zipping 8-Bit UFO --- */}
      <motion.div className="absolute top-[40%] w-[50px] opacity-80" animate={{ x: ["-10vw", "110vw"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 10 }}>
          <svg viewBox="0 0 60 30" shapeRendering="crispEdges">
            <rect x="20" y="5" width="20" height="10" fill="#38bdf8" opacity="0.6" /> {/* Glass Dome */}
            <rect x="5" y="15" width="50" height="5" fill="#d4d4d8" /> {/* Hull top */}
            <rect x="15" y="20" width="30" height="5" fill="#71717a" /> {/* Hull bottom */}
            {/* Blinking Alien Green Lights */}
            <rect x="10" y="15" width="5" height="5" fill="#bef264" className="animate-pulse" />
            <rect x="27" y="15" width="5" height="5" fill="#bef264" className="animate-pulse" />
            <rect x="45" y="15" width="5" height="5" fill="#bef264" className="animate-pulse" />
          </svg>
      </motion.div>

      {/* Existing Shooting Star */}
      <motion.div
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent z-0"
        style={{ width: "150px", top: "15%", left: "-10%", rotate: "15deg" }}
        animate={{ x: ["0vw", "120vw"], y: ["0vh", "30vh"], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 8, ease: "linear" }}
      />

      {/* Existing Interactive Auroras */}
      <motion.div style={{ x: x1, y: y1 }} className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-fuchsia-600/30 rounded-full blur-[140px] mix-blend-screen" />
      <motion.div style={{ x: x2, y: y2 }} className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-emerald-500/20 rounded-full blur-[150px] mix-blend-screen" />
      <motion.div style={{ x: x3, y: y3 }} className="absolute top-[10%] left-[20%] w-[80vw] h-[80vw] bg-blue-800/20 rounded-full blur-[160px] mix-blend-screen" />
      <div className="absolute inset-0 bg-grid-pattern opacity-50 mix-blend-overlay"></div>
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>
    </div>
  );
}