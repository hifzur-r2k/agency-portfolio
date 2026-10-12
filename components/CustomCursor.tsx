"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", updateMousePosition);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <>
      {/* THE TINY CENTER DOT (No delay, instantaneous) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference"
        animate={{ 
          x: mousePosition.x - 4, // Center the 8px dot
          y: mousePosition.y - 4 
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />

      {/* THE GLIDING OUTER RING (Has the smooth physics delay) */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{ 
          x: mousePosition.x - 20, // Center the 40px ring
          y: mousePosition.y - 20 
        }}
        transition={{ 
          type: "tween", 
          ease: "easeOut", 
          duration: 0.2 
        }}
      />
    </>
  );
}