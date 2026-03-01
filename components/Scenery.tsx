// src/components/Scenery.tsx
import { motion } from "framer-motion";

export default function Scenery({ isDarkMode }: { isDarkMode: boolean }) {
  
  // Dynamic color palette based on time of day
  const cityColors = isDarkMode 
    ? ["#080808", "#050505", "#0a0a0a", "#060606", "#040404"] 
    : ["#d4d4d8", "#e4e4e7", "#a1a1aa", "#d4d4d8", "#71717a"];
    
  const windowColor = isDarkMode ? "bg-yellow-500" : "bg-sky-400";
  const mountainFill = isDarkMode ? "#1c1411" : "#A64B31"; // Dark brown vs Desert Orange
  const mountainStroke = isDarkMode ? "#2d211c" : "#C15B3D";
  const rockColors = isDarkMode ? ["#140f0c", "#2d211c"] : ["#8c3b22", "#c46740"];

  const CityBlock = () => (
    <div className="flex items-end h-full w-[100vw] shrink-0">
      {/* Building 1 */}
      <div className={`w-[15%] h-[40%] relative border-t-[3px] border-r-[3px] border-white/10`} style={{ backgroundColor: cityColors[0] }}>
        <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className={`absolute top-6 left-6 w-4 h-4 ${windowColor}/40`} />
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} className={`absolute top-16 left-12 w-4 h-4 ${windowColor}/50`} />
      </div>
      
      {/* Building 2 */}
      <div className={`w-[20%] h-[70%] relative border-t-[3px] border-r-[3px] border-white/10`} style={{ backgroundColor: cityColors[1] }}>
        <div className="absolute -top-10 left-1/2 w-2 h-10" style={{ backgroundColor: cityColors[1] }} /> 
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }} className={`absolute top-16 left-8 w-5 h-5 ${windowColor}/60`} />
        <motion.div animate={{ opacity: [0.1, 0.7, 0.1] }} transition={{ duration: 2.5, repeat: Infinity }} className={`absolute top-32 right-8 w-5 h-5 ${windowColor}/40`} />
      </div>
      
      {/* Building 3 */}
      <div className={`w-[15%] h-[50%] relative border-t-[3px] border-r-[3px] border-white/10`} style={{ backgroundColor: cityColors[2] }}>
        <div className={`absolute top-8 left-4 w-4 h-4 ${windowColor}/30`} />
      </div>
      
      {/* Building 4 */}
      <div className={`w-[25%] h-[35%] relative border-t-[3px] border-r-[3px] border-white/10`} style={{ backgroundColor: cityColors[3] }}>
        <motion.div animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 3.5, repeat: Infinity }} className={`absolute top-8 left-12 w-4 h-4 ${windowColor}/50`} />
        <div className={`absolute top-20 left-24 w-4 h-4 ${windowColor}/20`} />
      </div>
      
      {/* Building 5 */}
      <div className={`w-[25%] h-[80%] relative border-t-[3px] border-l-[3px] border-white/10`} style={{ backgroundColor: cityColors[4] }}>
         <motion.div animate={{ opacity: [0.1, 0.6, 0.1] }} transition={{ duration: 2, repeat: Infinity }} className={`absolute top-24 left-10 w-5 h-5 ${windowColor}/40`} />
         <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} className={`absolute top-48 right-16 w-5 h-5 ${windowColor}/50`} />
         <div className="absolute top-4 left-1/2 w-3 h-3 bg-red-500/80 rounded-none animate-ping" />
      </div>
    </div>
  );

  return (
    <section className="relative w-full h-[500px] mt-20 overflow-hidden pointer-events-none opacity-95 z-10">
      <motion.div 
        className="absolute bottom-0 flex w-[200vw] h-[350px] z-0"
        animate={{ x: ["0vw", "-100vw"] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <CityBlock />
        <CityBlock />
      </motion.div>

      <div className="absolute bottom-0 w-full h-[400px] z-10 flex justify-center">
        <div className="relative w-full max-w-7xl h-full">
          <svg 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-full drop-shadow-[0_-15px_25px_rgba(0,0,0,0.8)] transition-all duration-1000" 
            viewBox="0 0 1400 400" 
            fill="none" 
            shapeRendering="crispEdges" 
            preserveAspectRatio="xMidYMax meet"
            overflow="visible"
          >
            {/* The Mountain Base */}
            <path 
              d="M 0 400 L 80 400 L 80 340 L 180 340 L 180 290 L 300 290 L 300 230 L 420 230 L 420 180 L 550 180 L 550 120 L 650 120 L 650 60 L 750 60 L 750 100 L 880 100 L 880 170 L 1000 170 L 1000 240 L 1150 240 L 1150 310 L 1280 310 L 1280 370 L 1400 370 L 1400 400 Z" 
              fill={mountainFill} 
              stroke={mountainStroke}
              strokeWidth="4"
              style={{ transition: "fill 1s ease, stroke 1s ease" }}
            />

            {/* Scattered Pixel Rocks */}
            <rect x="250" y="320" width="16" height="12" fill={rockColors[0]} />
            <rect x="380" y="260" width="20" height="10" fill={rockColors[1]} />
            <rect x="480" y="210" width="12" height="12" fill={rockColors[0]} />
            <rect x="700" y="140" width="24" height="16" fill={rockColors[1]} />
            <rect x="850" y="190" width="16" height="16" fill={rockColors[0]} />
            <rect x="1050" y="280" width="30" height="12" fill={rockColors[1]} />
            <rect x="1200" y="340" width="16" height="16" fill={rockColors[0]} />
            
            {/* Animated Sparky */}
            <motion.g animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
              <image 
                href="/sparky.png" 
                x="640" y="-60" width="120" height="120" 
                style={{ imageRendering: "pixelated" }}
                filter="drop-shadow(0px 5px 10px rgba(140, 29, 64, 0.4))"
              />
            </motion.g>

            {/* The 8-Bit Golden 'A' */}
            <g filter="drop-shadow(0px 0px 15px rgba(251, 191, 36, 0.8))">
              <rect x="580" y="140" width="60" height="20" fill="#fbbf24" />
              <rect x="560" y="160" width="20" height="70" fill="#fbbf24" />
              <rect x="640" y="160" width="20" height="70" fill="#fbbf24" />
              <rect x="580" y="180" width="60" height="20" fill="#fbbf24" />
            </g>
          </svg>
        </div>
      </div>

      {/* Ground Line Fade */}
      <div className={`absolute bottom-0 w-full h-16 bg-gradient-to-t ${isDarkMode ? 'from-black' : 'from-zinc-900'} to-transparent z-20`} />
    </section>
  );
}