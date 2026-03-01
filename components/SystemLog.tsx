// src/components/SystemLog.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const logs = [
  "[INFO] Initializing offline ASR module...",
  "[OK] Whisper-tiny loaded (quantized CPU context)",
  "[INFO] Capturing audio stream...",
  "[INFO] Running inference pipeline -> Speech-to-Text",
  "[OK] Gemma-3n edge response generated",
  "[INFO] Mapping English grammar to ASL Gloss...",
  "[INFO] Stitching 300+ MP4 gloss segments via FFmpeg...",
  "[SUCCESS] ASL video rendered locally in 1.2s",
];

export default function SystemLog() {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < logs.length) {
        // FIX 1: Capture the string in a constant before React defers the state update
        const currentLog = logs[currentIndex]; 
        
        setVisibleLogs((prev) => [...prev, currentLog]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 max-w-4xl mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="bg-[#050505] border border-white/10 rounded-xl p-6 font-mono text-xs md:text-sm shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-transparent"></div>
        <div className="space-y-2">
          {visibleLogs.map((log, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              // FIX 2: Added optional chaining (?.) to prevent crashes if undefined ever slips through
              className={`${log?.includes('[SUCCESS]') || log?.includes('[OK]') ? 'text-emerald-400' : 'text-zinc-500'}`}
            >
              {log}
            </motion.div>
          ))}
          <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-4 bg-zinc-400 mt-2" />
        </div>
      </motion.div>
    </section>
  );
}