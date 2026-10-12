"use client";

import { motion } from "framer-motion";
import Link from "next/link"; // Next.js magic link for instant page transitions

// Placeholder projects for your client's portfolio
const projects = [
  { id: 1, title: "Urban Architecture", category: "Web Design", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "Aura Skincare", category: "Digital Marketing", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "Neo Banking App", category: "App Dev", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, title: "Neon Nights", category: "Video Production", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop" },
];

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA] pt-32 pb-24 px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <Link href="/" className="text-gray-500 hover:text-white transition-colors mb-12 inline-block uppercase tracking-widest text-sm font-bold">
          ← Back to Home
        </Link>

        {/* Cinematic Header Reveal */}
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-16 leading-[0.9]"
        >
          Selected <br/><span className="text-gray-500">Works</span>
        </motion.h1>

        {/* Portfolio Grid with Staggered Load-In */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              // Stagger the animation so they load one after another!
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              className="group cursor-none flex flex-col gap-4"
            >
              {/* Image Container with Hover Zoom */}
              <div className="overflow-hidden rounded-xl aspect-[4/3] bg-[#0a0a0a] border border-white/10">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
              
              {/* Project Info */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 group-hover:border-white/50 transition-colors duration-500">
                <h3 className="text-2xl font-bold uppercase tracking-tight">{project.title}</h3>
                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">{project.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}