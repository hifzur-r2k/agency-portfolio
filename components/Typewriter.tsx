"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  "Digital Marketing",
  "Video Production",
  "Graphic Design",
  "Web & App Development",
];

export default function Typewriter() {
  const [index, setIndex] = useState(0);

  // Cycles through the words every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      // Positioned cleanly in the corner, pushed down slightly on mobile
      className="absolute top-24 left-6 md:top-12 md:left-12 z-50 flex items-center gap-4 pointer-events-none"
    >
      {/* Minimalist architectural tracking line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-8 md:w-12 h-[1px] bg-white/40 origin-left" 
      />
      
      {/* The Masked Ticker Container */}
      <div className="relative h-6 md:h-8 overflow-hidden flex items-center">
        {/* AnimatePresence allows elements to animate OUT before disappearing */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
            // Custom easing curve for that premium "Apple" feel
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="text-white/80 font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium whitespace-nowrap"
          >
            {services[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}