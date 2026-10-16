"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  { id: "01", title: "Digital Marketing", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop" },
  { id: "02", title: "Video Production", image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2000&auto=format&fit=crop" },
  { id: "03", title: "Graphic Design", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop" },
  { id: "04", title: "Web & App Dev", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop" }
];

export default function Services() {
  // Mobile fix included: '0' makes the first image visible by default
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <section 
      id="services" 
      className="min-h-screen w-full bg-[#050505] text-[#FAFAFA] py-24 px-8 flex flex-col justify-center border-t border-white/10"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div className="flex flex-col gap-6 relative z-10 order-2 md:order-1">
          <p className="text-gray-500 uppercase tracking-widest mb-4 text-sm font-bold">Our Expertise</p>
          
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="group cursor-pointer md:cursor-none"
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => setHoveredIndex(index)}
            >
              <div className="flex items-center gap-4 md:gap-6 border-b border-white/10 pb-6 transition-colors duration-500 group-hover:border-white/50">
                <span className={`text-lg md:text-xl font-light transition-colors duration-500 ${hoveredIndex === index ? 'text-white' : 'text-gray-600'}`}>
                  {service.id}
                </span>
                <h3 className={`text-3xl md:text-6xl font-bold transition-colors duration-500 uppercase tracking-tighter ${hoveredIndex === index ? 'text-white' : 'text-gray-600'}`}>
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-[300px] md:h-[600px] w-full rounded-xl overflow-hidden order-1 md:order-2">
          <AnimatePresence mode="wait">
            <motion.img
              key={hoveredIndex}
              src={services[hoveredIndex].image}
              alt={services[hoveredIndex].title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}