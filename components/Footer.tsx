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
    <section className="w-full bg-[#050505] text-[#FAFAFA] pt-16 pb-24 md:py-24 px-4 md:px-8 border-t border-white/5 z-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-16 relative z-10">
        
        {/* TOP ROW: Header & CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
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
          <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-5 md:p-8 rounded-[1.25rem] md:rounded-[2rem] border border-white/5 flex flex-col gap-4 md:gap-10 md:justify-between md:aspect-square backdrop-blur-sm">
            <TypewriterTag text="#HEADQUARTERS" />
            <div>
              <p className="text-xl md:text-2xl font-medium tracking-tight">New Delhi, India</p>
              <p className="text-gray-500 text-xs md:text-sm mt-1">Available Worldwide</p>
            </div>
          </div>

          {/* Box 2: Social Links WITH LOGOS & #LINK TAGS */}
          <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-5 md:p-8 rounded-[1.25rem] md:rounded-[2rem] border border-white/5 flex flex-col gap-4 md:justify-between md:aspect-square backdrop-blur-sm">
            <TypewriterTag text="#SOCIAL_NETWORK" delay={0.2} />
            <div className="flex flex-col gap-4 w-full">
              
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between w-full text-white/70 hover:text-white transition-colors">
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span className="text-base md:text-lg">Instagram</span>
                </div>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between w-full text-white/70 hover:text-white transition-colors">
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="text-base md:text-lg">LinkedIn</span>
                </div>
                
              </a>

              {/* Twitter (X) */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between w-full text-white/70 hover:text-white transition-colors">
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 ml-0.5" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-base md:text-lg">Twitter (X)</span>
                </div>
            
              </a>

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