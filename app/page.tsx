"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Services from "../components/Services"; 
import Marquee from "../components/Marquee"; 
import Footer from "../components/Footer"; 
import Hero3D from "../components/Hero3D"; 
import Typewriter from "../components/Typewriter";
import FloatingGallery from "@/components/FloatingGallery";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    
    gsap.fromTo(el, 
      { opacity: 0, y: 100 }, 
      {
        opacity: 1,
        y: 0, 
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        }
      }
    );
  }, []);

  // Guaranteed smooth scroll handler for anchor links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const item: Variants = {
    hidden: { y: "120%", opacity: 0 },
    show: { y: "0%", opacity: 1, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } },
  };

  return (
    <main className="flex flex-col items-center">
      
      {/* THE TYPEWRITER COMPONENT */}
      <Typewriter />

      {/* SECTION 1: THE ANIMATED HERO */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center p-8 text-center border-b border-white/10 overflow-hidden">
        
        {/* The 3D Wireframe in the background */}
        <Hero3D />
        
        {/* 1. DEAD CENTER: Balanced Headline & Clear 5-Second Description */}
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 flex flex-col items-center pointer-events-none px-4">
          <div className="overflow-hidden mb-1">
            <motion.h1 variants={item} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white">
              We Engineer
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6 md:mb-8">
            <motion.h1 variants={item} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-gray-500">
              Experiences
            </motion.h1>
          </div>
          <div className="overflow-hidden mt-4">
            <motion.p variants={item} className="text-xs md:text-sm text-gray-400 max-w-xl font-light tracking-wide leading-relaxed">
              From high-converting <span className="text-gray-200 font-medium">web apps</span> and <span className="text-gray-200 font-medium">brand design</span> to <span className="text-gray-200 font-medium">cinematic video</span> and <span className="text-gray-200 font-medium">growth marketing</span> — we build digital ecosystems that scale.
            </motion.p>
          </div>
        </motion.div>

        {/* 2. BOTTOM LEFT CORNER: Services Anchor with Micro-Label */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 text-left pointer-events-auto hidden sm:block"
        >
          {/* Micro-label so users immediately know this block is interactive */}
          <p className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-2">
            Explore Capabilities ↓
          </p>
          <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 leading-relaxed flex flex-col items-start gap-1">
            <div>
              <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer">
                Digital Marketing
              </a>
              <span className="mx-2 text-gray-700 pointer-events-none">•</span>
              <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer">
                Video Production
              </a>
            </div>
            <div>
              <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer">
                Graphic Design
              </a>
              <span className="mx-2 text-gray-700 pointer-events-none">•</span>
              <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer">
                Web & App Dev
              </a>
            </div>
          </div>
        </motion.div>

        {/* 3. BOTTOM RIGHT CORNER: Emphasized View Work Anchor */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 text-right pointer-events-auto hidden sm:block"
        >
          <a 
            href="#portfolio" 
            onClick={(e) => scrollToSection(e, "portfolio")} 
            className="group inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-white/40 hover:border-white pb-1.5 transition-all duration-300 cursor-pointer drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
          >
            <span>View Our Work</span>
            <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
          </a>
        </motion.div>

        {/* MOBILE ONLY: Clean bottom bar for small screens */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-6 left-0 w-full flex items-end justify-between px-6 z-10 sm:hidden pointer-events-auto"
        >
          <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-[8px] font-semibold uppercase tracking-[0.12em] text-gray-400 text-left w-2/3 leading-relaxed">
            <span className="block text-[7px] text-gray-500 mb-0.5">What We Do ↓</span>
            Digital Marketing • Video Prod <br/> Graphic Design • Web Dev
          </a>
          <a href="#portfolio" onClick={(e) => scrollToSection(e, "portfolio")} className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/50 pb-1 transition-colors text-right">
            Work ↗
          </a>
        </motion.div>

      </section>

      {/* 2. THE FLOATING GALLERY PORTFOLIO SECTION (Wrapped with #portfolio ID) */}
      <div id="portfolio" className="w-full">
        <FloatingGallery />
      </div>

      {/* SECTION 4: THE SERVICES SHOWCASE (Wrapped with #services ID) */}
      <div id="services" className="w-full">
        <Services />
      </div>

      {/* SECTION 5: THE INFINITE MARQUEE */}
      <Marquee />

      {/* SECTION 6: THE EXPERIENCE TERMINAL (FOOTER) */}
      <Footer />

    </main>
  );
}