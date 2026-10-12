"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* THE CAMERA WIPE: A dark curtain that starts covering the screen and slides down */}
      <motion.div
        className="fixed inset-0 z-[9999] bg-[#050505] pointer-events-none"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* THE PAGE CONTENT: Pushed slightly down and fades up beautifully */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}