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

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      // Repositioned: Clears the navbar on mobile/tablet (top-24/28), tucks into the corner on desktop
      className="absolute top-[90px] left-6 md:top-[110px] md:left-8 lg:top-10 lg:left-12 z-40 flex items-center gap-3 pointer-events-none"
    >
      {/* Sleek, minimal architectural line. No dots. */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="w-4 sm:w-8 h-[1px] bg-white/30 origin-left" 
      />
      
      {/* Raw, elegant typography */}
      <div className="relative h-5 overflow-hidden flex items-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
            className="text-gray-400 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-medium whitespace-nowrap"
          >
            {services[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}