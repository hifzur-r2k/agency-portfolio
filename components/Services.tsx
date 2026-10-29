"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  { 
    id: "01", 
    title: "Digital Marketing", 
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    desc: "We drive hyper-growth and dominate your niche with data-driven campaigns.",
    tags: ["Meta & Google Ads", "Performance Funnels", "SEO & Analytics"]
  },
  { 
    id: "02", 
    title: "Video Production", 
    image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=1200&auto=format&fit=crop",
    desc: "Cinematic storytelling that captures attention and converts casual viewers.",
    tags: ["Commercial Shoots", "High-Retention Edits", "Color & Sound Design"]
  },
  { 
    id: "03", 
    title: "Graphic Design", 
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
    desc: "Bold, aesthetic visual assets that engineer a memorable brand identity.",
    tags: ["Brand Identity", "Packaging Systems", "Campaign Creatives"]
  },
  { 
    id: "04", 
    title: "Web & App Dev", 
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    desc: "High-performance digital ecosystems built for speed, scale, and conversion.",
    tags: ["Next.js Web Apps", "Custom Dashboards", "iOS & Android Apps"]
  }
];

export default function Services() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section 
      id="services" 
      className="min-h-screen w-full bg-[#050505] text-[#FAFAFA] py-24 px-4 md:px-8 flex flex-col justify-center border-t border-white/10"
    >
      <div className="max-w-7xl w-full mx-auto mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-mono mb-2">Our Expertise</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">What We Do</h2>
        </div>
        <Link 
          href="/portfolio" 
          className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors w-fit"
        >
          View All Case Studies ↗
        </Link>
      </div>

      <div 
        onMouseLeave={() => setActive(null)}
        className="max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-4 h-[80vh] md:h-[600px]"
      >
        {services.map((service, index) => {
          const isActive = active === index;
          const isCollapsedStrip = active !== null && !isActive;
          const flexClass = active === null ? "flex-[1]" : (isActive ? "flex-[4]" : "flex-[0.8]");

          return (
            <motion.div
              key={service.id}
              layout
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 cursor-pointer md:cursor-none transition-all duration-500 ease-in-out flex ${flexClass}`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                style={{ 
                  backgroundImage: `url(${service.image})`, 
                  transform: active === null ? "scale(1)" : (isActive ? "scale(1.02)" : "scale(1.12)") 
                }}
              />
              
              {/* Multi-Stop Dark Gradient so white text is 100% readable */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 transition-opacity duration-500 ${
                  active === null ? "opacity-85" : (isActive ? "opacity-80" : "opacity-90")
                }`} 
              />

              {/* Panel Content */}
              <div className="relative z-10 w-full h-full p-6 md:p-8 flex flex-col justify-between pointer-events-none">
                
                {/* Top Row: Number & Subtle Prompt */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg md:text-xl font-bold text-white/80">
                    {service.id}
                  </span>
                  {active === null && (
                    <span className="hidden lg:inline-block text-[10px] font-mono uppercase tracking-widest text-gray-400">
                      Explore +
                    </span>
                  )}
                </div>

                {/* Bottom Content Area */}
                <div className="relative flex items-end">
                  {isActive ? (
                    // STATE 1: EXPANDED VIEW (Full Details + Portfolio Link)
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.15, duration: 0.35 }}
                      className="w-full"
                    >
                      <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter mb-3 leading-none text-white">
                        {service.title}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-lg leading-relaxed mb-5">
                        {service.desc}
                      </p>

                      {/* Sub-Service Pills */}
                      <div className="hidden sm:flex flex-wrap gap-2 mb-6">
                        {service.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-[10px] font-mono uppercase tracking-wider text-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Deep Link directly to filtered Portfolio */}
                      <Link
                        href={`/portfolio?category=${encodeURIComponent(service.title)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="pointer-events-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-gray-200 transition-colors"
                      >
                        <span>View {service.title} Work</span>
                        <span>↗</span>
                      </Link>
                    </motion.div>
                  ) : isCollapsedStrip ? (
                    // STATE 2: NARROW COLLAPSED STRIP (Vertical text only when another card is open)
                    <div className="hidden md:block absolute bottom-4 left-6 origin-bottom-left -rotate-90 whitespace-nowrap">
                      <h3 className="text-lg font-bold uppercase tracking-widest text-white/50">
                        {service.title}
                      </h3>
                    </div>
                  ) : (
                    // STATE 3: DEFAULT RESTING STATE (Clean Horizontal Title!)
                    <div className="w-full">
                      <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-white leading-tight mb-2">
                        {service.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 line-clamp-2 hidden lg:block">
                        {service.desc}
                      </p>
                    </div>
                  )}

                  {/* Mobile Collapsed Fallback */}
                  {isCollapsedStrip && (
                    <div className="md:hidden">
                      <h3 className="text-lg font-bold uppercase tracking-tighter text-white/60">
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