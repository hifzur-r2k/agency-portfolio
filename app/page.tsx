"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Services from "../components/Services"; 
import Marquee from "../components/Marquee"; 
import Footer from "../components/Footer"; 
import Hero3D from "../components/Hero3D"; 

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
      
      {/* SECTION 1: THE ANIMATED HERO */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center p-8 text-center border-b border-white/10 overflow-hidden">
        <Hero3D />
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 flex flex-col items-center pointer-events-none">
          <div className="overflow-hidden mb-2">
            <motion.h1 variants={item} className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
              We Engineer
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1 variants={item} className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-gray-500">
              Experiences
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.p variants={item} className="text-sm md:text-lg text-gray-400 max-w-2xl tracking-wide uppercase">
              Digital Marketing • Video Production • Graphic Design • Web & App Dev
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: THE MANIFESTO */}
      <section className="h-screen w-full flex items-center justify-center p-8 bg-[#FAFAFA] text-[#050505]">
        <h2 ref={textRef} className="text-3xl md:text-6xl font-medium max-w-5xl leading-tight text-center">
          We don't just build websites or shoot videos. We craft <span className="font-serif italic">digital ecosystems</span> that Astonish visitors and convert them into absolute loyalists.
        </h2>
      </section>

      {/* SECTION 3: THE SERVICES SHOWCASE */}
      <Services />

      {/* SECTION 4: THE INFINITE MARQUEE */}
      <Marquee />

      {/* SECTION 5: THE EXPERIENCE TERMINAL (FOOTER) */}
      <Footer />

    </main>
  );
}