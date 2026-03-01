// src/components/Experience.tsx
"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "../lib/animations";
import { ArrowRight } from "lucide-react";

const experiences = [
  {
    id: 1,
    role: "AI & Machine Learning Intern",
    company: "APMAC Consulting",
    date: "Aug 2025 – Present",
    linkedProject: "apmac",
    points: [
      "Developed and integrated AI/ML models (OLS regression and AutoML pipelines) within a SaaS platform to estimate workforce productivity, delivering predictions with 95% confidence intervals.",
      "Built and stabilized backend ML workflows for dataset ingestion, feature/target selection, model training, and prediction serving.",
      "Collaborated in an Agile team to translate SMB requirements into production features with robust ethical and data-privacy safeguards."
    ],
    tags: ["AutoML", "SaaS Backend", "Python", "Agile"]
  },
  {
    id: 2,
    role: "Team Lead",
    company: "Visionary Hands - ASL Glove Data Integration",
    date: "Jan 2024 – Dec 2025",
    linkedProject: "visionary",
    points: [
      "Led a team of 7 through the design and testing of a wearable glove translating ASL into text and audio, winning the $1,000 EPICS Elite Pitch.",
      "Integrated flex sensors, accelerometers, and microcontrollers to recognize 26 ASL letters, improving accuracy by 30%.",
      "Implemented Java and C++ translation algorithms on Arduino hardware and documented the data transformation pipeline for real-time conversion."
    ],
    tags: ["Leadership", "C++", "Java", "Hardware Integration"]
  },
  {
    id: 3,
    role: "Intern",
    company: "Programming and Activities Board @ ASU",
    date: "Sep 2024 – Dec 2025",
    linkedProject: null,
    points: [
      "Plan, execute, and manage large-scale campus events with 400+ attendees.",
      "Coordinate and lead volunteer teams to ensure successful event execution.",
      "Collaborate directly with the production team to design and manage event setups across the university campus."
    ],
    tags: ["Event Management", "Leadership", "Logistics"]
  },
  {
    id: 4,
    role: "Undergrad Teaching Assistant",
    company: "Arizona State University",
    date: "Aug 2024 – Dec 2024",
    linkedProject: null,
    points: [
      "Facilitated weekly lab sessions for 40+ students on geodesic domes, 3D printing, and polymer synthesis.",
      "Supervised lab sessions, guiding students to apply lecture-based technical skills using MATLAB for data analysis.",
      "Helped students complete their design projects on schedule through active mentorship."
    ],
    tags: ["MATLAB", "Mentorship", "Data Analysis"]
  },
  {
    id: 5,
    role: "E2 Camp Counselor",
    company: "Arizona State University",
    date: "Jul 2024 – Aug 2024",
    linkedProject: null,
    points: [
      "Led team-building and STEM-oriented activities for 60+ incoming freshmen.",
      "Enforced discipline and policies to protect the safety of recreational activity participants.",
      "Established and built relationships with campers to ease fears and foster inclusion in a new environment."
    ],
    tags: ["STEM Advocacy", "Team Building", "Conflict Resolution"]
  },
  {
    id: 6,
    role: "Spain Coral Reef Restoration Research Lead",
    company: "EPICS @ ASU",
    date: "Jan 2023 – Dec 2023",
    linkedProject: null,
    points: [
      "Researched and prototyped 3D-printed coral structures to promote marine biodiversity in Barcelona.",
      "Collaborated cross-functionally with material scientists and marine biologists to test and refine reef-building designs."
    ],
    tags: ["3D Printing", "Research", "Cross-Functional Integration"]
  }
];

export default function Experience({ isDarkMode }: { isDarkMode?: boolean }) {
  const jumpToProject = (projectId: string) => {
    window.history.pushState(null, '', `#project-${projectId}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="experience" className="py-24 relative z-10 border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6">
        <h3 className={`text-xl font-mono mb-16 tracking-widest uppercase ${isDarkMode ? 'text-zinc-500' : 'text-slate-800 font-bold'}`}>
          [Professional Experience]
        </h3>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          {experiences.map((exp) => (
            <motion.div 
              key={exp.id}
              variants={fadeInUp}
              className={`relative group grid grid-cols-1 md:grid-cols-12 gap-8 items-start p-8 rounded-2xl transition-all duration-300 backdrop-blur-sm
                ${isDarkMode 
                  ? 'bg-white/[0.03] border border-white/10 shadow-2xl hover:border-blue-500/30 hover:bg-white/[0.05]' 
                  : 'bg-white/40 border border-black/10 shadow-xl hover:bg-white/60 hover:border-blue-500/50'}`}
            >
              <div className="md:col-span-4">
                <p className={`text-sm font-mono mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-600 font-bold'}`}>{exp.date}</p>
                <h4 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{exp.company}</h4>
                <p className={`font-medium mt-1 ${isDarkMode ? 'text-blue-500' : 'text-blue-700 font-bold'}`}>{exp.role}</p>
              </div>

              <div className="md:col-span-8 flex flex-col h-full">
                <ul className="space-y-3 mb-6">
                  {exp.points.map((point, i) => (
                    <li key={i} className={`text-sm leading-relaxed flex items-start ${isDarkMode ? 'text-zinc-400' : 'text-slate-800 font-medium'}`}>
                      <span className="text-blue-500 mr-3 mt-1">▹</span>
                      {point}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map(tag => (
                      <span key={tag} className={`text-[10px] px-3 py-1 rounded-full border ${isDarkMode ? 'bg-white/5 text-zinc-300 border-white/10' : 'bg-black/5 text-slate-800 border-black/10 font-bold'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {exp.linkedProject && (
                    <button 
                      onClick={() => jumpToProject(exp.linkedProject as string)}
                      className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400 transition-all group/btn uppercase tracking-widest"
                    >
                      View Architecture 
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}