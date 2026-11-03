"use client";

import { motion } from "framer-motion";

export default function PortfolioSkeleton() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA] pt-32 pb-24 px-6 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-gray-500 mb-10 inline-block uppercase tracking-widest text-xs font-bold opacity-50">
          ← Back to Home
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 border-b border-white/10 pb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]"
          >
            Selected <br />
            <span className="text-gray-500">Works</span>
          </motion.div>

          {/* Skeleton Category Pills */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 md:w-32 bg-white/5 rounded-full animate-pulse border border-white/5" />
            ))}
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              {/* Image Box Skeleton */}
              <div className="w-full aspect-[4/3] rounded-xl bg-white/5 animate-pulse border border-white/10" />
              {/* Title & Category Line Skeleton */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}