"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  
  const [contactMode, setContactMode] = useState<"cal" | "email" | "wa">("cal");

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const item: Variants = {
    hidden: { y: "120%", opacity: 0 },
    show: { y: "0%", opacity: 1, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } },
  };

  return (
    <main className="flex flex-col items-center">
      
      <Typewriter />

      {/* SECTION 1: THE ANIMATED HERO */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center p-8 text-center border-b border-white/10 overflow-hidden">
        <Hero3D />
        
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 text-left pointer-events-auto hidden sm:block">
          <p className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-2">Explore Capabilities ↓</p>
          <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 leading-relaxed flex flex-col items-start gap-1">
            <div>
              <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer">Digital Marketing</a>
              <span className="mx-2 text-gray-700 pointer-events-none">•</span>
              <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer">Video Production</a>
            </div>
            <div>
              <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer">Graphic Design</a>
              <span className="mx-2 text-gray-700 pointer-events-none">•</span>
              <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer">Web & App Dev</a>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 text-right pointer-events-auto hidden sm:block">
          <a href="#portfolio" onClick={(e) => scrollToSection(e, "portfolio")} className="group inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-white/40 hover:border-white pb-1.5 transition-all duration-300 cursor-pointer drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            <span>View Our Work</span>
            <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute bottom-6 left-0 w-full flex items-end justify-between px-6 z-10 sm:hidden pointer-events-auto">
          <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-[8px] font-semibold uppercase tracking-[0.12em] text-gray-400 text-left w-2/3 leading-relaxed">
            <span className="block text-[7px] text-gray-500 mb-0.5">What We Do ↓</span>
            Digital Marketing • Video Prod <br/> Graphic Design • Web Dev
          </a>
          <a href="#portfolio" onClick={(e) => scrollToSection(e, "portfolio")} className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/50 pb-1 transition-colors text-right">
            Work ↗
          </a>
        </motion.div>
      </section>

      <div id="portfolio" className="w-full">
        <FloatingGallery />
      </div>

      <div id="services" className="w-full">
        <Services />
      </div>

      <Marquee />

      {/* SECTION 6: PREMIUM TERMINAL CONTACT SECTION */}
      <section id="contact" className="relative w-full py-20 md:py-32 bg-[#050505] border-t border-white/10 px-6 overflow-hidden">
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/[0.03] via-[#050505] to-[#050505] pointer-events-none"></div>

        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 lg:items-start pt-4 lg:pt-10">
          
          {/* LEFT COLUMN: Headings & 3-Way Toggle */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-gray-300">Accepting New Projects</span>
            </div>

            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-[0.9]">
              Ready to <br className="hidden lg:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">Scale?</span>
            </h2>
            
            <p className="text-sm md:text-base text-gray-400 font-light tracking-wide max-w-[340px] mb-10 leading-relaxed">
              We're excited to learn about your vision. Book a discovery call, drop us an email, or start a direct chat to get moving instantly.
            </p>

            {/* UPGRADED 3-Way Toggle (Better visibility, hover states, and minimalist icons) */}
            <div className="relative flex items-center p-1.5 bg-white/[0.04] border border-white/10 rounded-full z-20 shadow-[0_0_30px_rgba(255,255,255,0.02)] w-max mx-auto lg:mx-0">
              
              <button
                onClick={() => setContactMode("cal")}
                className={`flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  contactMode === "cal" 
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Book Call
              </button>

              <button
                onClick={() => setContactMode("email")}
                className={`flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  contactMode === "email" 
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email
              </button>

              <button
                onClick={() => setContactMode("wa")}
                className={`flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  contactMode === "wa" 
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                WhatsApp
              </button>
            </div>

            <div className="mt-12 hidden lg:flex flex-col gap-6">
              <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">1</div>
                <p className="text-xs font-medium text-gray-300">Choose your communication channel</p>
              </div>
              <div className="w-[1px] h-4 bg-white/10 ml-4 -my-4"></div>
              <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">2</div>
                <p className="text-xs font-medium text-gray-300">Share your vision and requirements</p>
              </div>
              <div className="w-[1px] h-4 bg-white/10 ml-4 -my-4"></div>
              <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">3</div>
                <p className="text-xs font-medium text-gray-300">We'll map out your next big move</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Glowing Glassmorphic Container */}
          <div className="lg:col-span-7 w-full h-[650px] lg:h-[620px] flex items-start justify-center relative mt-8 lg:mt-0">
            
            <div className="absolute inset-4 bg-gradient-to-r from-gray-500/20 to-gray-800/20 rounded-[2rem] blur-2xl opacity-50 z-0"></div>

            {/* LAYER 1: CAL.COM IFRAME */}
            <div
              className={`absolute inset-0 w-full h-full bg-[#080808]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ease-in-out z-10 ${
                contactMode === "cal" ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-[0.98]"
              }`}
            >
              <iframe
                src="https://cal.com/zero-gravity-l7pwsp/30min?theme=dark" 
                className="w-full h-full border-none [color-scheme:dark]"
                loading="lazy"
              />
            </div>

            {/* LAYER 2: EMAIL FORM */}
            <div
              className={`absolute w-full max-w-xl bg-[#080808]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl transition-all duration-500 ease-in-out z-10 ${
                contactMode === "email" ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-[0.98]"
              }`}
            >
              <form className="flex flex-col gap-5 md:gap-6" onSubmit={(e) => { e.preventDefault(); alert("Form submitted! Connect this to your backend."); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest ml-1">Name</label>
                    <input type="text" required className="bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] border border-white/5 rounded-xl p-4 text-sm text-white focus:border-white/30 focus:outline-none transition-all duration-300" placeholder="John Doe" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest ml-1">Email</label>
                    <input type="email" required className="bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] border border-white/5 rounded-xl p-4 text-sm text-white focus:border-white/30 focus:outline-none transition-all duration-300" placeholder="john@company.com" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest ml-1">Project Details</label>
                  <textarea required rows={4} className="bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] border border-white/5 rounded-xl p-4 text-sm text-white focus:border-white/30 focus:outline-none transition-all duration-300 resize-none" placeholder="Tell us about your goals, budget, and timeline..." />
                </div>
                <button type="submit" className="group relative w-full py-4 mt-2 bg-white text-black font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-[1.02] active:scale-95">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Initialize Transmission 
                    <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                  </span>
                </button>
              </form>
            </div>

            {/* LAYER 3: WHATSAPP DIRECT CHAT */}
            <div
              className={`absolute w-full max-w-xl bg-[#080808]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-14 shadow-2xl transition-all duration-500 ease-in-out z-10 flex flex-col items-center justify-center text-center mt-8 lg:mt-0 ${
                contactMode === "wa" ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-[0.98]"
              }`}
            >
              <div className="w-20 h-20 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center mb-6 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-4">
                Instant Access.
              </h3>
              <p className="text-sm text-gray-400 font-light tracking-wide mb-10 max-w-sm mx-auto leading-relaxed">
                Skip the forms. Connect directly with our lead strategist on WhatsApp to discuss your project in real-time.
              </p>
              
              <a 
                href="https://wa.me/916388776067?text=Hey%20Zero%20Gravity%20team!%20I'd%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-[1.02] active:scale-95 flex justify-center items-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Open WhatsApp Chat
                  <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ml-1">↗</span>
                </span>
              </a>
            </div>
              
          </div>
        </div>
      </section>

      <Footer />

    </main>
  );
}