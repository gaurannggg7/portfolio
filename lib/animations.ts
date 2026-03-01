// src/lib/animations.ts
import { Variants } from "framer-motion";

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
};

export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};