// src/lib/animations.ts

// The Stagger Container creates that beautiful cascading effect
// where items load one after the other (like your experience cards)
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Smooth delay between each child
      delayChildren: 0.1,
    },
  },
};

// The new GSAP-style Fade In Up
// Notice the slight 'scale' and the heavy spring physics (damping/mass)
export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.96, // Starts slightly pushed back
    filter: "blur(4px)" // Slight blur for a cinematic reveal
  },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 40,   // Low stiffness = slow, elegant movement
      damping: 20,     // High damping = no bouncy cartoon effect
      mass: 1.5,       // Adds "weight" to the animation
      duration: 1.2    // Longer duration for that premium feel
    } 
  },
};

// A new horizontal slide-in for variety (great for section headers)
export const slideInLeft = {
  hidden: { opacity: 0, x: -60, filter: "blur(4px)" },
  show: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 40, 
      damping: 20, 
      mass: 1.5 
    } 
  },
};