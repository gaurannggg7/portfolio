// src/components/Contact.tsx
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, ShoppingBag } from "lucide-react";

export default function Contact({ isDarkMode }: { isDarkMode?: boolean }) {
  return (
    <section id="contact" className="relative z-20 flex flex-col items-center justify-center pt-32 pb-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h2 className={`text-2xl font-bold tracking-widest uppercase mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Contact
        </h2>

        <div className={`space-y-3 font-mono text-sm mb-8 ${isDarkMode ? 'text-zinc-400' : 'text-slate-700 font-medium'}`}>
          <p>
            Email:{" "}
            <a 
              href="mailto:gaurangmohan25@gmail.com" 
              className="text-blue-500 hover:text-blue-400 transition-colors font-bold"
            >
              gaurangmohan25@gmail.com
            </a>
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <a 
            href="mailto:gaurangmohan25@gmail.com" 
            className={`p-3 border rounded-full transition-all group 
              ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/60 border-black/10 hover:bg-white hover:shadow-md'}`}
            title="Email"
          >
            <Mail className={`w-6 h-6 transition-colors ${isDarkMode ? 'text-zinc-300 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'}`} />
          </a>
          
          <a 
            href="https://www.linkedin.com/in/gaurangmmohan/" 
            target="_blank" 
            rel="noreferrer" 
            className={`p-3 border rounded-full transition-all group 
              ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/60 border-black/10 hover:bg-white hover:shadow-md'}`}
            title="LinkedIn"
          >
            <Linkedin className={`w-6 h-6 transition-colors ${isDarkMode ? 'text-zinc-300 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'}`} />
          </a>
          
          <a 
            href="https://github.com/gaurannggg7" 
            target="_blank" 
            rel="noreferrer" 
            className={`p-3 border rounded-full transition-all group 
              ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/60 border-black/10 hover:bg-white hover:shadow-md'}`}
            title="GitHub"
          >
            <Github className={`w-6 h-6 transition-colors ${isDarkMode ? 'text-zinc-300 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'}`} />
          </a>
          
          <a 
            href="https://www.amway.com/en_US/myshop/gaurangmohan" 
            target="_blank" 
            rel="noreferrer" 
            className={`p-3 border rounded-full transition-all group 
              ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/60 border-black/10 hover:bg-white hover:shadow-md'}`}
            title="My Shop"
          >
            <ShoppingBag className={`w-6 h-6 transition-colors ${isDarkMode ? 'text-zinc-300 group-hover:text-emerald-400' : 'text-slate-700 group-hover:text-emerald-600'}`} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}