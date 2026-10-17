"use client";

import { motion } from "framer-motion";
import Link from "next/link"; // We need this to travel between pages!

export default function Footer() {
  return (
    <section className="w-full bg-[#050505] text-[#FAFAFA] py-24 px-8 border-t border-white/10 z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* TOP ROW: Huge Call to Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter max-w-2xl leading-[0.9]">
            Let's Build <br/>
            <span className="text-gray-500">Something</span>
          </h2>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors"
          >
            Start a Project
          </motion.button>
        </div>

        {/* BOTTOM ROW: The Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          
          {/* Box 1: Location & Time */}
          <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 flex flex-col justify-between aspect-video md:aspect-square">
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-8">Headquarters</p>
            <div>
              <p className="text-2xl font-medium">New Delhi, India</p>
              <p className="text-gray-500 text-lg mt-1">Available Worldwide</p>
            </div>
          </div>

          {/* Box 2: Social Links */}
          <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 flex flex-col justify-between aspect-video md:aspect-square">
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-8">Socials</p>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-xl hover:text-gray-400 transition-colors">Instagram</a>
              <a href="#" className="text-xl hover:text-gray-400 transition-colors">LinkedIn</a>
              <a href="#" className="text-xl hover:text-gray-400 transition-colors">Twitter (X)</a>
            </div>
          </div>

          {/* Box 3: Portfolio Link (Turned into a real Link tag!) */}
          <Link href="/portfolio" className="block">
            <div className="bg-white text-black p-8 rounded-2xl flex flex-col justify-between h-full aspect-video md:aspect-square group cursor-none hover:bg-gray-200 transition-colors">
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-8">Next Page</p>
              <h3 className="text-4xl font-black uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-300">
                View Portfolio →
              </h3>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}