"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Retaining the bypassed component to prevent Turbopack caching errors
function TypewriterTag({ text, delay = 0 }: { text: string; delay?: number }) {
  const chars = text.split("");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05, delayChildren: delay },
        },
      }}
      className="font-mono text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest flex mb-6 md:mb-8"
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function Footer() {
  return (
    <section className="w-full bg-[#050505] text-[#FAFAFA] pt-16 pb-32 md:py-24 px-4 md:px-8 border-t border-white/5 z-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-16 relative z-10">
        
        {/* TOP ROW: Header & CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter max-w-2xl leading-[0.9]">
            Let's Build <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">
              Something
            </span>
          </h2>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // FIX 1: Changed 'w-full' to 'w-fit' so it remains a sleek pill on mobile
            className="w-fit bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm shadow-xl"
          >
            Start a Project
          </motion.button>
        </div>

        {/* BOTTOM ROW: The Glass Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-2 md:mt-8">
          
          {/* Box 1: Location */}
          {/* FIX 2: Removed forced min-height and used natural gap spacing for organic mobile sizing */}
          <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 flex flex-col gap-6 md:justify-between md:aspect-square backdrop-blur-sm">
            <TypewriterTag text="#HEADQUARTERS" />
            <div>
              <p className="text-xl md:text-2xl font-medium tracking-tight">New Delhi, India</p>
              <p className="text-gray-500 text-sm mt-1">Available Worldwide</p>
            </div>
          </div>

          {/* Box 2: Social Links */}
          <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 flex flex-col gap-6 md:justify-between md:aspect-square backdrop-blur-sm">
            <TypewriterTag text="#SOCIAL_NETWORK" delay={0.2} />
            <div className="flex flex-col gap-2">
              <a href="#" className="text-base md:text-xl text-white/80 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-base md:text-xl text-white/80 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-base md:text-xl text-white/80 hover:text-white transition-colors">Twitter (X)</a>
            </div>
          </div>

          {/* Box 3: Portfolio Link */}
          <Link href="/portfolio" className="block h-full">
            <div className="bg-white text-black p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col gap-6 md:justify-between md:aspect-square group cursor-none hover:bg-gray-200 transition-colors shadow-lg">
              
              {/* FIX 3: Actually applied the TypewriterTag here! */}
              <TypewriterTag text="#NEXT_PAGE" delay={0.4} />
              
              <div className="flex items-center justify-between">
                {/* FIX 4: Changed tracking-tighter to tracking-tight to fix the word collision */}
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                  View Portfolio
                </h3>
                <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}