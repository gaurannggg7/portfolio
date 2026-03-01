// src/components/Hero.tsx
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "../lib/animations";
import { Download } from "lucide-react";

export default function Hero({ isDarkMode = true }: { isDarkMode?: boolean }) {
  return (
    <section id="about" className="relative pt-28 pb-16 border-b border-white/10 z-10 flex flex-col justify-center min-h-[90vh]">
      
      {/* Navigation Bar - NOW SPLIT LEFT AND RIGHT */}
      <nav className="absolute top-0 w-full flex justify-between items-center p-6 lg:px-12 border-b border-white/10 z-50 bg-black/20 backdrop-blur-md">
        
        {/* LEFT SIDE: Status Indicator */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className={`hidden sm:block text-xs font-mono tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-slate-800 font-bold'}`}>
            STATUS: DEPLOYING INTELLIGENCE
          </span>
        </div>
        
        {/* RIGHT SIDE: Navigation Links */}
        <div className={`hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest ${isDarkMode ? 'text-zinc-300' : 'text-slate-900 font-bold'}`}>
          <a href="#about" className="hover:text-blue-400 transition-colors drop-shadow-md">About Me</a>
          <a href="#experience" className="hover:text-blue-400 transition-colors drop-shadow-md">Experience</a>
          <a href="#projects" className="hover:text-blue-400 transition-colors drop-shadow-md">Projects</a>
          <a href="#contact" className="hover:text-blue-400 transition-colors drop-shadow-md">Contact</a>
        </div>
      </nav>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-6 mt-12 text-center"
      >
        {/* Name */}
        <motion.h1 variants={fadeInUp} className={`text-4xl md:text-5xl font-mono font-extrabold tracking-tight mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Gaurang Mohan
        </motion.h1>
        
        {/* Bio Paragraphs */}
        <motion.div variants={fadeInUp} className={`text-xs md:text-sm leading-relaxed mb-8 space-y-4 text-center max-w-2xl mx-auto font-mono transition-colors duration-500 ${isDarkMode ? 'text-zinc-300 drop-shadow-md' : 'text-slate-700 font-bold'}`}>
          <p>
            Hello! I'm Gaurang, a Computer Science graduate (May 2026) passionate about building AI systems that solve real-world problems at scale. I focus on predictive modeling with data privacy safeguards and shipping production-ready ML pipelines—not just high-accuracy notebooks.
          </p>
          <p>
            Currently, I'm an AI/ML Intern at APMAC Consulting, where I developed AutoML pipelines estimating workforce productivity with 95% confidence intervals. This year, I shipped SignLink, an offline ASL translation system that helps Hard-of-Hearing users communicate seamlessly across doctors' offices, airports, and family video calls. Previously, I led hardware + ML integration at Visionary Hands, designing an edge-AI glove translating sign language in real-time.
          </p>
          <p>
            I'm actively seeking full-time opportunities in AI/ML engineering, preferably with OPT sponsorship or H1-B support (I'm an international student). I'm also building an e-commerce business on the side—if you're interested in discussing potential opportunities there, I'd love to connect.
          </p>
          <p>
            Outside of engineering, my curiosity usually takes me away from the screen—whether that's sketching and painting, getting lost in a good book, or exploring my deep interest in neuroscience and human behavior. Thanks for checking out my work!
          </p>
        </motion.div>

        {/* Resume Button */}
        <motion.a 
          variants={fadeInUp}
          href="/GAURANG-MOHAN_RESUME.pdf" 
          target="_blank"
          className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-mono font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] 
            ${isDarkMode ? 'bg-white text-black hover:bg-blue-500 hover:text-white' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
        >
          <Download className="w-4 h-4" />
          Download Resume
        </motion.a>
      </motion.div>
    </section>
  );
}