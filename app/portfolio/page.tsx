"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const projects = [
  { 
    id: 1, 
    title: "Urban Architecture", 
    category: "Web Design", 
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
    description: "A complete digital overhaul for a premier architectural firm. We built a 3D-heavy WebGL portfolio that allows users to explore building models in real-time right from their browser."
  },
  { 
    id: 2, 
    title: "Aura Skincare", 
    category: "Digital Marketing", 
    img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop",
    description: "A high-converting e-commerce campaign resulting in a 300% increase in Q4 sales. We handled everything from the initial product photography to the targeted social media ad rollout."
  },
  { 
    id: 3, 
    title: "Neo Banking App", 
    category: "App Dev", 
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    description: "A fully custom iOS and Android application built for a modern fintech startup. Features include biometric login, real-time crypto tracking, and instant peer-to-peer transfers."
  },
  { 
    id: 4, 
    title: "Neon Nights", 
    category: "Video Production", 
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop",
    description: "A cinematic commercial shoot for an upcoming streetwear brand. Shot on RED cameras, this fast-paced editorial video captures the gritty, vibrant energy of the city nightlife."
  },
];

type Project = typeof projects[0];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA] pt-32 pb-24 px-8 relative z-10">
      
      {/* THE MAIN GALLERY */}
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors mb-12 inline-block uppercase tracking-widest text-sm font-bold">
          ← Back to Home
        </Link>

        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter mb-16 leading-[0.9]"
        >
          Selected <br/><span className="text-gray-500">Works</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer flex flex-col gap-4"
            >
              <div className="overflow-hidden rounded-xl aspect-[4/3] bg-[#0a0a0a] border border-white/10">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4 group-hover:border-white/50 transition-colors duration-500">
                <h3 className="text-2xl font-bold uppercase tracking-tight">{project.title}</h3>
                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">{project.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* THE FULL-SCREEN EXPANSION MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-12"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-6xl rounded-2xl overflow-y-auto max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
            >
              
              <div className="w-full md:w-3/5 aspect-video md:aspect-auto md:h-[70vh]">
                <img 
                  src={selectedProject.img} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between relative">
                
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 text-gray-500 hover:text-white text-3xl transition-colors"
                >
                  ✕
                </button>

                <div>
                  <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4">
                    {selectedProject.category}
                  </p>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                    {selectedProject.title}
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>
                </div>

                <button className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors w-fit">
                  View Live Site
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}