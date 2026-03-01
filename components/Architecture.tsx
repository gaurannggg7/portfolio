// src/components/Architecture.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mic, Cpu, BrainCircuit, FileText, Video, ArrowRight,
  Database, Filter, LineChart, Server, 
  HandMetal, Microchip, Binary, Volume2,
  Map, Layers, MapPin, MonitorPlay,
  Github, Play, Presentation
} from "lucide-react";

const architectures = [
  {
    id: "signlink",
    title: "SignLink: Offline ASL Translator",
    description: "Real-time edge translation system.",
    themeColor: "from-blue-500/10",
    borderColor: "hover:border-blue-500/50",
    primaryLink: "https://youtu.be/33DwsluZMfA?si=ArQjaE0VxIeLGVGz",
    linkText: "Watch Demo",
    linkIcon: Play,
    github: "https://github.com/gaurannggg7/signlink",
    nodes: [
      { id: 1, title: "Speech Input", icon: Mic, tags: ["Offline Audio"] },
      { id: 2, title: "Whisper (ASR)", icon: Cpu, tags: ["Quantized", "PyTorch"] },
      { id: 3, title: "Gemma-3n", icon: BrainCircuit, tags: ["Edge LLM"] },
      { id: 4, title: "Gloss Builder", icon: FileText, tags: ["NLP", "Python"] },
      { id: 5, title: "FFmpeg Renderer", icon: Video, tags: ["Video Stitching"] },
    ]
  },
  {
    id: "apmac",
    title: "APMAC: SaaS ML Pipeline",
    description: "Backend ML workflows for workforce productivity prediction.",
    themeColor: "from-emerald-500/10",
    borderColor: "hover:border-emerald-500/50",
    primaryLink: null,
    github: null,
    nodes: [
      { id: 1, title: "Dataset Ingestion", icon: Database, tags: ["SQL", "Pandas"] },
      { id: 2, title: "Feature Selection", icon: Filter, tags: ["Scikit-Learn"] },
      { id: 3, title: "AutoML / OLS", icon: LineChart, tags: ["95% CI"] },
      { id: 4, title: "Prediction Serving", icon: Server, tags: ["Backend Inference"] },
    ]
  },
  {
    id: "visionary",
    title: "Visionary Hands: Embedded System",
    description: "Wearable glove translating ASL gestures into text/audio.",
    themeColor: "from-purple-500/10",
    borderColor: "hover:border-purple-500/50",
    primaryLink: "https://github.com/gaurannggg7/vs-spring25",
    linkText: "View Repository",
    linkIcon: Github,
    github: "https://github.com/gaurannggg7/vs-spring25",
    nodes: [
      { id: 1, title: "Flex Sensors", icon: HandMetal, tags: ["Hardware", "Accel"] },
      { id: 2, title: "Arduino", icon: Microchip, tags: ["C++", "Microcontroller"] },
      { id: 3, title: "Translation Algo", icon: Binary, tags: ["Java", "Logic"] },
      { id: 4, title: "Text & Audio Out", icon: Volume2, tags: ["Real-time UI"] },
    ]
  },
  {
    id: "spacehack",
    title: "SpaceHACK 25: Geospatial Analytics",
    description: "Multi-layer risk mapping for urban food insecurity.",
    themeColor: "from-orange-500/10",
    borderColor: "hover:border-orange-500/50",
    primaryLink: "https://docs.google.com/presentation/d/1pZ4uj7TJLrP7FQke3R3ZJxvANbYYbjn2/edit?usp=sharing",
    linkText: "View Slides",
    linkIcon: Presentation,
    github: "https://github.com/gaurannggg7/Urban-Food-Insecurity-in-Phoenix-SpaceHACK-25",
    nodes: [
      { id: 1, title: "Data Aggregation", icon: Layers, tags: ["NDVI", "Census"] },
      { id: 2, title: "Geospatial Map", icon: Map, tags: ["Cleaning"] },
      { id: 3, title: "Risk Overlays", icon: MapPin, tags: ["Analysis"] },
      { id: 4, title: "Visual Solutions", icon: MonitorPlay, tags: ["Data-Backed"] },
    ]
  }
];

export default function Architecture({ isDarkMode }: { isDarkMode?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#project-', '');
      const index = architectures.findIndex(a => a.id === hash);
      if (index !== -1) setActiveIndex(index);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCardClick = (index: number, primaryLink: string | null) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
    } else if (primaryLink) {
      window.open(primaryLink, '_blank');
    }
  };

  return (
    <section id="projects" className="py-24 relative z-10 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h3 className={`text-xl font-mono tracking-widest uppercase ${isDarkMode ? 'text-zinc-500' : 'text-slate-800 font-bold'}`}>
          [Projects]
        </h3>
      </div>
      
      <div className="relative flex justify-center items-center h-[550px] w-full perspective-[1200px]">
        {architectures.map((project, index) => {
          const offset = index - activeIndex;
          const isCenter = offset === 0;
          
          return (
            <motion.div 
              key={project.id}
              animate={{
                x: `calc(${offset * 75}%)`,
                scale: isCenter ? 1 : 0.85,
                rotateY: offset * -15, 
                opacity: Math.abs(offset) >= 2 ? 0 : isCenter ? 1 : 0.4,
                zIndex: 10 - Math.abs(offset)
              }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
              onClick={() => handleCardClick(index, project.primaryLink)}
              className={`absolute w-[95%] max-w-4xl p-8 rounded-3xl transition-colors duration-300 shadow-2xl border 
                ${isCenter ? 'cursor-default' : 'cursor-pointer pointer-events-auto'}
                ${isDarkMode 
                  ? `bg-[#09090b] ${isCenter ? `border-white/20 ${project.borderColor}` : 'border-white/5'}` 
                  : `bg-white/60 backdrop-blur-md ${isCenter ? `border-black/20 ${project.borderColor}` : 'border-black/5'}`}`}
            >
              
              <div className={`absolute inset-0 bg-gradient-to-br ${project.themeColor} to-transparent opacity-40 rounded-3xl pointer-events-none`} />

              <div className={`relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-l-2 pl-4 ${isDarkMode ? 'border-white/50' : 'border-slate-800'}`}>
                <div>
                  <h4 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{project.title}</h4>
                  <p className={`text-sm font-mono mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-700 font-medium'}`}>{project.description}</p>
                </div>
                
                {isCenter && (project.primaryLink || project.github) && (
                  <div className="flex gap-3 mt-4 md:mt-0">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} 
                         className={`p-2 rounded-full transition-colors border ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-zinc-400' : 'bg-black/5 border-black/10 hover:bg-black/10 hover:text-black text-slate-700'}`}>
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.primaryLink && project.linkIcon && (
                      <a href={project.primaryLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} 
                         className={`flex items-center gap-2 px-5 py-2 rounded-full transition-colors font-bold text-sm border 
                           ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20 border-white/10' : 'bg-slate-900 text-white hover:bg-slate-800 border-transparent'}`}>
                        <project.linkIcon className="w-4 h-4" />
                        {project.linkText}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Node Pipeline */}
              <div className="relative z-10 flex overflow-x-auto no-scrollbar pb-4 pt-2 -mx-2 px-2 items-center justify-start gap-4">
                {project.nodes.map((node, nIndex) => (
                  <div key={node.id} className="flex items-center gap-4 shrink-0">
                    <div className={`group border p-5 rounded-2xl w-40 h-40 flex flex-col transition-all 
                      ${isDarkMode ? 'bg-black/50 border-white/10 hover:bg-black hover:border-white/30' : 'bg-white/50 border-black/10 hover:bg-white hover:border-blue-500/30 shadow-sm'}`}>
                      <node.icon className={`w-7 h-7 mb-3 transition-colors ${isDarkMode ? 'text-zinc-300 group-hover:text-white' : 'text-slate-700 group-hover:text-blue-600'}`} />
                      <h5 className={`font-bold mb-1 text-sm leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{node.title}</h5>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {node.tags.map(tag => (
                          <span key={tag} className={`text-[9px] px-2 py-1 rounded-md ${isDarkMode ? 'bg-white/10 text-zinc-300' : 'bg-black/5 text-slate-800 font-bold'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {nIndex !== project.nodes.length - 1 && (
                      <ArrowRight className={`w-5 h-5 shrink-0 ${isDarkMode ? 'text-zinc-600' : 'text-slate-500'}`} />
                    )}
                  </div>
                ))}
              </div>

              {!isCenter && (
                <div className={`absolute inset-0 flex items-center justify-center rounded-3xl opacity-0 hover:opacity-100 transition-opacity z-20 ${isDarkMode ? 'bg-black/40' : 'bg-white/40 backdrop-blur-sm'}`}>
                  <span className={`px-6 py-2 font-mono text-sm rounded-full border ${isDarkMode ? 'bg-black text-white border-white/20' : 'bg-white text-slate-900 border-black/20 font-bold shadow-md'}`}>
                    Click to Focus
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex justify-center gap-3 mt-8 relative z-10">
        {architectures.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${activeIndex === i ? (isDarkMode ? 'w-8 bg-white' : 'w-8 bg-slate-800') : (isDarkMode ? 'bg-white/20' : 'bg-black/20')}`}
          />
        ))}
      </div>
    </section>
  );
}