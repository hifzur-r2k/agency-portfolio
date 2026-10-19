"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const services = [
  { 
    id: "01", 
    title: "Digital Marketing", 
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
    desc: "We drive hyper-growth and dominate your niche with data-driven campaigns."
  },
  { 
    id: "02", 
    title: "Video Production", 
    image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2000&auto=format&fit=crop",
    desc: "Cinematic storytelling that captures attention and converts casual viewers."
  },
  { 
    id: "03", 
    title: "Graphic Design", 
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    desc: "Bold, aesthetic visual assets that engineer a memorable brand identity."
  },
  { 
    id: "04", 
    title: "Web & App Dev", 
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop",
    desc: "High-performance digital ecosystems built for speed, scale, and conversion."
  }
];

export default function Services() {
  // Set to null so they all start as equal strips and reset when the mouse leaves
  const [active, setActive] = useState<number | null>(null);

  return (
    <section 
      id="services" 
      className="min-h-screen w-full bg-[#050505] text-[#FAFAFA] py-24 px-4 md:px-8 flex flex-col justify-center border-t border-white/10"
    >
      <div className="max-w-7xl w-full mx-auto mb-10">
        <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-2">Our Expertise</p>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">What We Do</h2>
      </div>

      <div 
        // Resets all panels back to equal strips when the mouse leaves the gallery area
        onMouseLeave={() => setActive(null)}
        className="max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-4 h-[75vh] md:h-[600px]"
      >
        {services.map((service, index) => {
          const isActive = active === index;
          
          // Width logic: all equal if null, otherwise active is huge and others are small
          const flexClass = active === null ? "flex-[1]" : (isActive ? "flex-[4]" : "flex-[1]");

          return (
            <motion.div
              key={service.id}
              layout
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              // Added md:cursor-none so your Custom Cursor's negative color effect works flawlessly
              className={`group relative overflow-hidden rounded-2xl cursor-pointer md:cursor-none transition-all duration-500 ease-in-out flex ${flexClass}`}
            >
              {/* Background Image Container */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                style={{ 
                  backgroundImage: `url(${service.image})`, 
                  transform: active === null ? "scale(1)" : (isActive ? "scale(1)" : "scale(1.1)") 
                }}
              />
              
              {/* Dark Overlay adjusts dynamically based on state */}
              <div 
                className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                  active === null ? "opacity-50 group-hover:opacity-40" : (isActive ? "opacity-30" : "opacity-70")
                }`} 
              />

              {/* Panel Content (pointer-events-none ensures text doesn't interrupt the hover state) */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
                
                {/* Always show the Number at the top left */}
                <span className={`font-mono text-xl font-bold transition-colors duration-500 ${active === null ? "text-white/80" : "text-white/60"}`}>
                  {service.id}
                </span>

                <div className="relative h-full flex items-end">
                  {isActive ? (
                    // What shows when EXPANDED
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="whitespace-normal"
                    >
                      <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-3 leading-none text-white">
                        {service.title}
                      </h3>
                      <p className="text-gray-200 md:text-lg max-w-lg leading-relaxed hidden md:block">
                        {service.desc}
                      </p>
                    </motion.div>
                  ) : (
                    // What shows when COLLAPSED (Rotated text)
                    <div className="hidden md:block absolute bottom-8 left-8 origin-bottom-left -rotate-90 whitespace-nowrap">
                      <h3 className={`text-2xl font-bold uppercase tracking-widest transition-colors duration-500 ${active === null ? "text-white" : "text-white/40"}`}>
                        {service.title}
                      </h3>
                    </div>
                  )}
                  
                  {/* Mobile inactive title fallback */}
                  {!isActive && (
                    <div className="md:hidden">
                      <h3 className={`text-xl font-bold uppercase tracking-tighter transition-colors duration-500 ${active === null ? "text-white" : "text-white/40"}`}>
                         {service.title}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}