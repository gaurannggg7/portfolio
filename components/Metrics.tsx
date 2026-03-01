// components/Metrics.tsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Metric = ({ label, value }: { label: string; value: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={() => { setIsFocused(true); setOpacity(1); }}
      onBlur={() => { setIsFocused(false); setOpacity(0); }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative flex flex-col items-center justify-center p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl text-white font-medium overflow-hidden group transition-colors hover:border-blue-500/30"
    >
      {/* The Mouse-Tracking Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 text-4xl font-extrabold text-white mb-2">{value}</div>
      <div className="relative z-10 text-sm text-zinc-400 text-center">{label}</div>
    </motion.div>
  );
};

export default function Metrics() {
  return (
    <section className="py-20 relative z-10 border-t border-white/10 ">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-xl font-mono text-zinc-500 mb-12 tracking-widest uppercase">
          [Deployment Metrics]
        </h3>
        <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-2">
          <Metric label="Confidence Interval (APMAC)" value="95%" />
          <Metric label="Signs Indexed (SignLink)" value="300+" />
          <Metric label="Engineers Led" value="7" />
          <Metric label="Hardware Accuracy" value="+30%" />
        </div>
      </div>
    </section>
  );
}