"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function TypewriterTag({ text, delay = 0 }: { text: string; delay?: number }) {
  const chars = text.split("");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: delay } },
      }}
      className="font-mono text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest flex"
    >
      {chars.map((char, i) => (
        <motion.span key={i} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function Footer() {
  return (
    // Severely reduced pt-32 to pt-16 and pb-32 to pb-24 to tighten the entire section
    <section className="w-full bg-[#050505] text-[#FAFAFA] pt-16 pb-24 md:py-24 px-4 md:px-8 border-t border-white/5 z-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-16 relative z-10">
        
        {/* TOP ROW: Header & CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
          {/* Reduced mobile text size to ensure it doesn't push the grid down */}
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter max-w-2xl leading-[0.9]">
            Let's Build <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">
              Something
            </span>
          </h2>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="self-start md:self-end bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-sm shadow-xl"
          >
            Start a Project
          </motion.button>
        </div>

        {/* BOTTOM ROW: The Glass Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-2">
          
          {/* Box 1: Location */}
          {/* Halved the padding and interior gap to eliminate negative space */}
          <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-5 md:p-8 rounded-[1.25rem] md:rounded-[2rem] border border-white/5 flex flex-col gap-4 md:gap-10 md:justify-between md:aspect-square backdrop-blur-sm">
            <TypewriterTag text="#HEADQUARTERS" />
            <div>
              <p className="text-xl md:text-2xl font-medium tracking-tight">New Delhi, India</p>
              <p className="text-gray-500 text-xs md:text-sm mt-1">Available Worldwide</p>
            </div>
          </div>

          {/* Box 2: Social Links */}
          <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-5 md:p-8 rounded-[1.25rem] md:rounded-[2rem] border border-white/5 flex flex-col gap-4 md:gap-10 md:justify-between md:aspect-square backdrop-blur-sm">
            <TypewriterTag text="#SOCIAL_NETWORK" delay={0.2} />
            <div className="flex flex-col gap-1 md:gap-2">
              <a href="#" className="text-base md:text-xl text-white/80 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-base md:text-xl text-white/80 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-base md:text-xl text-white/80 hover:text-white transition-colors">Twitter (X)</a>
            </div>
          </div>

          {/* Box 3: Portfolio Link */}
          <Link href="/portfolio" className="block h-full">
            <div className="bg-white text-black p-5 md:p-8 rounded-[1.25rem] md:rounded-[2rem] flex flex-col gap-4 md:gap-10 md:justify-between md:aspect-square group cursor-none hover:bg-gray-200 transition-colors shadow-lg">
              <p className="text-gray-500 font-mono uppercase tracking-widest text-[9px] md:text-xs font-bold">
                #NEXT_PAGE
              </p>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter group-hover:translate-x-2 transition-transform duration-300">
                  View Portfolio
                </h3>
                <span className="text-xl md:text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}