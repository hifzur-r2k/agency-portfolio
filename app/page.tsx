"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sendEmail } from "@/app/actions/sendEmail";
import { usePostHog } from "posthog-js/react";

import Services from "../components/Services";
import Marquee from "../components/Marquee";
import Footer from "../components/Footer";
import Hero3D from "../components/Hero3D";
import Typewriter from "../components/Typewriter";
import FloatingGallery from "@/components/FloatingGallery";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: "How long does a typical web, branding, or video project take?",
    a: "Most high-converting web applications and brand identity systems take 3 to 6 weeks from strategy to launch. Rapid campaign assets and commercial video edits are delivered within 7 to 14 days.",
  },
  {
    q: "Do you work with early-stage startups or established enterprises?",
    a: "Both. We partner with ambitious seed-stage startups looking to make a category-defining debut and established brands aiming to modernize their digital architecture and scale customer acquisition.",
  },
  {
    q: "How does your pricing and engagement model work?",
    a: "We offer fixed-scope project sprints for web builds, brand systems, and video production, alongside monthly growth retainers for ongoing performance marketing and product engineering.",
  },
  {
    q: "What makes Zero Gravity different from traditional agencies?",
    a: "Traditional agencies separate design, code, and marketing into slow silos. We engineer them as one unified system—combining 3D/Next.js speed, cinema-grade visuals, and data-backed conversion funnels.",
  },
  {
    q: "What happens right after I book a call or send a message?",
    a: "You'll receive an instant calendar invite or confirmation. Before we meet, our lead strategist reviews your current brand presence so we spend 100% of our call mapping actionable growth strategies.",
  },
];

export default function Home() {
  const textRef = useRef(null);
  const posthog = usePostHog();

  // Contact Toggle & Form State
  const [contactMode, setContactMode] = useState<"cal" | "email" | "wa">("cal");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const wordCount =
    formData.message.trim() === "" ? 0 : formData.message.trim().split(/\s+/).length;

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
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

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Project details are required.";
    } else if (wordCount > 100) {
      newErrors.message = "Limit description to 100 words.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("loading");

    try {
      const serverData = new FormData();
      serverData.append("name", formData.name);
      serverData.append("email", formData.email);
      serverData.append("message", formData.message);

      const result = await sendEmail(serverData);

      if (result?.error) {
        setStatus("error");
        setErrors({ message: result.error });
      } else {
        setStatus("success");
        posthog?.capture("Successfully Sent Message", { location: "homepage_terminal" });
        setTimeout(() => {
          setStatus("idle");
          setFormData({ name: "", email: "", message: "" });
          setErrors({});
        }, 5000);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus("error");
      setErrors({ message: "Server connection failed. Please try again." });
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
    <main className="flex flex-col items-center w-full overflow-x-hidden">
      <Typewriter />

      {/* SECTION 1: THE ANIMATED HERO (100dvh for mobile browser bars + fluid clamp typography) */}
      <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 sm:p-8 text-center border-b border-white/10 overflow-hidden">
        <Hero3D />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-center pointer-events-none px-2 sm:px-4 max-w-[1440px] mx-auto"
        >
          <div className="overflow-hidden mb-1">
            <motion.h1
              variants={item}
              className="text-[clamp(2.25rem,7vw,5.75rem)] font-black tracking-tighter uppercase leading-[0.9] text-white"
            >
              We Engineer
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6 md:mb-8">
            <motion.h1
              variants={item}
              className="text-[clamp(2.25rem,7vw,5.75rem)] font-black tracking-tighter uppercase leading-[0.9] text-gray-500"
            >
              Experiences
            </motion.h1>
          </div>
          <div className="overflow-hidden mt-2 sm:mt-4">
            <motion.p
              variants={item}
              className="text-xs sm:text-sm md:text-base text-gray-400 max-w-xl font-light tracking-wide leading-relaxed px-2"
            >
              From high-converting <span className="text-gray-200 font-medium">web apps</span> and{" "}
              <span className="text-gray-200 font-medium">brand design</span> to{" "}
              <span className="text-gray-200 font-medium">cinematic video</span> and{" "}
              <span className="text-gray-200 font-medium">growth marketing</span> — we build digital
              ecosystems that scale.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 text-left pointer-events-auto hidden sm:block"
        >
          <p className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-2">
            Explore Capabilities ↓
          </p>
          <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 leading-relaxed flex flex-col items-start gap-1">
            <div>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, "services")}
                className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer py-1"
              >
                Digital Marketing
              </a>
              <span className="mx-2 text-gray-700 pointer-events-none">•</span>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, "services")}
                className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer py-1"
              >
                Video Production
              </a>
            </div>
            <div>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, "services")}
                className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer py-1"
              >
                Graphic Design
              </a>
              <span className="mx-2 text-gray-700 pointer-events-none">•</span>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, "services")}
                className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer py-1"
              >
                Web & App Dev
              </a>
            </div>
          </div>
        </motion.div>

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
            <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
              ↗
            </span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-5 left-0 w-full flex items-end justify-between px-5 z-10 sm:hidden pointer-events-auto"
        >
          <a
            href="#services"
            onClick={(e) => scrollToSection(e, "services")}
            className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400 text-left w-2/3 leading-relaxed py-2"
          >
            <span className="block text-[8px] text-gray-500 mb-0.5">What We Do ↓</span>
            Digital Marketing • Video Prod <br /> Graphic Design • Web Dev
          </a>
          <a
            href="#portfolio"
            onClick={(e) => scrollToSection(e, "portfolio")}
            className="text-[11px] font-bold uppercase tracking-widest text-white border-b border-white/50 pb-1 transition-colors text-right py-2"
          >
            Work ↗
          </a>
        </motion.div>
      </section>

      {/* SECTION 2: PORTFOLIO GALLERY */}
      <div id="portfolio" className="w-full">
        <FloatingGallery />
      </div>

      {/* SECTION 3: SERVICES */}
      <div id="services" className="w-full">
        <Services />
      </div>

      {/* SECTION 4: INFINITE MARQUEE */}
      <Marquee />

      {/* SECTION 5: TRUST METRICS & FAQ ACCORDION (SEO + CONVERSION BRIDGE) */}
      <section className="w-full py-20 md:py-28 bg-[#050505] border-t border-white/10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* High-Impact Proof Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-16 mb-16 border-b border-white/10 text-center">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tighter mb-1">185%</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                Avg. Lead Lift
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tighter mb-1">3.2x</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                Campaign ROAS
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tighter mb-1">&lt;24h</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                Response SLA
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tighter mb-1">99.4%</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                On-Time Delivery
              </p>
            </div>
          </div>

          {/* FAQ Header */}
          <div className="text-center mb-12">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-3">
              Clarity Before Commitment
            </p>
            <h2 className="text-[clamp(1.75rem,4vw,3.25rem)] font-black uppercase tracking-tighter text-white leading-none">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">
                Questions
              </span>
            </h2>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer min-h-[56px]"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {faq.q}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-xs shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-white text-black" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <p className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-400 font-light leading-relaxed border-t border-white/5 pt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: PREMIUM TERMINAL CONTACT SECTION */}
      <section
        id="contact"
        className="relative w-full py-20 md:py-32 bg-[#050505] border-t border-white/10 px-4 sm:px-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/[0.03] via-[#050505] to-[#050505] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-start pt-4 lg:pt-10">
          {/* LEFT COLUMN: Headings & 3-Way Toggle */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-gray-300">
                Accepting New Projects
              </span>
            </div>

            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase tracking-tighter text-white mb-6 leading-[0.9]">
              Ready to <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">
                Scale?
              </span>
            </h2>

            <p className="text-sm md:text-base text-gray-400 font-light tracking-wide max-w-[340px] mb-8 sm:mb-10 leading-relaxed">
              We&apos;re excited to learn about your vision. Book a discovery call, drop us an
              email, or start a direct chat to get moving instantly.
            </p>

            {/* 3-Way Toggle (Flex-wrap safe for foldables + 44px touch target height) */}
            <div className="relative flex flex-wrap justify-center items-center gap-1 p-1.5 bg-white/[0.04] border border-white/10 rounded-2xl sm:rounded-full z-20 shadow-[0_0_30px_rgba(255,255,255,0.02)] w-full sm:w-max max-w-full mx-auto lg:mx-0">
              <button
                onClick={() => {
                  setContactMode("cal");
                  posthog?.capture("Clicked Book a Call");
                }}
                className={`flex items-center justify-center gap-1.5 px-4 sm:px-5 min-h-[42px] rounded-xl sm:rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer flex-1 sm:flex-initial ${
                  contactMode === "cal"
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book Call
              </button>

              <button
                onClick={() => {
                  setContactMode("email");
                  posthog?.capture("Clicked Send Message");
                }}
                className={`flex items-center justify-center gap-1.5 px-4 sm:px-5 min-h-[42px] rounded-xl sm:rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer flex-1 sm:flex-initial ${
                  contactMode === "email"
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </button>

              <button
                onClick={() => {
                  setContactMode("wa");
                  posthog?.capture("Clicked WhatsApp Tab");
                }}
                className={`flex items-center justify-center gap-1.5 px-4 sm:px-5 min-h-[42px] rounded-xl sm:rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer flex-1 sm:flex-initial ${
                  contactMode === "wa"
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                WhatsApp
              </button>
            </div>

            <div className="mt-12 hidden lg:flex flex-col gap-6">
              <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                  1
                </div>
                <p className="text-xs font-medium text-gray-300">
                  Choose your communication channel
                </p>
              </div>
              <div className="w-[1px] h-4 bg-white/10 ml-4 -my-4" />
              <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                  2
                </div>
                <p className="text-xs font-medium text-gray-300">
                  Share your vision and requirements
                </p>
              </div>
              <div className="w-[1px] h-4 bg-white/10 ml-4 -my-4" />
              <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                  3
                </div>
                <p className="text-xs font-medium text-gray-300">
                  We&apos;ll map out your next big move
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Glowing Glassmorphic Container */}
          <div className="lg:col-span-7 w-full h-[680px] sm:h-[650px] lg:h-[620px] flex items-start justify-center relative mt-4 lg:mt-0">
            <div className="absolute inset-4 bg-gradient-to-r from-gray-500/20 to-gray-800/20 rounded-[2rem] blur-2xl opacity-50 z-0" />

            {/* LAYER 1: CAL.COM IFRAME */}
            <div
              className={`absolute inset-0 w-full h-full bg-[#080808]/80 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ease-in-out z-10 ${
                contactMode === "cal"
                  ? "opacity-100 pointer-events-auto scale-100"
                  : "opacity-0 pointer-events-none scale-[0.98]"
              }`}
            >
              <iframe
                src="https://cal.com/zero-gravity-l7pwsp/30min?theme=dark"
                className="w-full h-full border-none [color-scheme:dark]"
                loading="lazy"
                title="Schedule a 30-Minute Discovery Call"
              />
            </div>

            {/* LAYER 2: REAL CONNECTED EMAIL FORM */}
            <div
              className={`absolute w-full max-w-xl bg-[#080808]/90 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl transition-all duration-500 ease-in-out z-10 ${
                contactMode === "email"
                  ? "opacity-100 pointer-events-auto scale-100"
                  : "opacity-0 pointer-events-none scale-[0.98]"
              }`}
            >
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,255,255,0.25)]">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-3 text-white">
                    Message Sent.
                  </h3>
                  <p className="text-gray-400 font-light text-sm max-w-xs">
                    We&apos;ve received your project details and will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-gray-400 font-mono uppercase tracking-widest ml-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        disabled={status === "loading"}
                        className={`bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] border rounded-xl p-4 text-sm text-white focus:outline-none transition-all duration-300 ${
                          errors.name
                            ? "border-red-500/60"
                            : "border-white/10 focus:border-white/40"
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <span className="text-[10px] text-red-400 ml-1">{errors.name}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-gray-400 font-mono uppercase tracking-widest ml-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        disabled={status === "loading"}
                        className={`bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] border rounded-xl p-4 text-sm text-white focus:outline-none transition-all duration-300 ${
                          errors.email
                            ? "border-red-500/60"
                            : "border-white/10 focus:border-white/40"
                        }`}
                        placeholder="john@company.com"
                      />
                      {errors.email && (
                        <span className="text-[10px] text-red-400 ml-1">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center mx-1">
                      <label className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                        Project Details
                      </label>
                      <span
                        className={`text-[10px] font-mono ${
                          wordCount > 100 ? "text-red-400" : "text-gray-500"
                        }`}
                      >
                        {wordCount} / 100 words
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: "" });
                      }}
                      disabled={status === "loading"}
                      className={`bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.06] border rounded-xl p-4 text-sm text-white focus:outline-none transition-all duration-300 resize-none ${
                        errors.message
                          ? "border-red-500/60"
                          : "border-white/10 focus:border-white/40"
                      }`}
                      placeholder="Tell us about your goals, budget, and timeline..."
                    />
                    {errors.message && (
                      <span className="text-[10px] text-red-400 ml-1">{errors.message}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group relative w-full py-4 mt-2 bg-white text-black font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 flex items-center justify-center min-h-[52px] cursor-pointer"
                  >
                    {status === "loading" ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <span className="relative flex items-center justify-center gap-2">
                        {status === "error" ? "Try Again" : "Send Message"}
                        <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                          ↗
                        </span>
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* LAYER 3: WHATSAPP DIRECT CHAT */}
            <div
              className={`absolute w-full max-w-xl bg-[#080808]/90 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 md:p-14 shadow-2xl transition-all duration-500 ease-in-out z-10 flex flex-col items-center justify-center text-center ${
                contactMode === "wa"
                  ? "opacity-100 pointer-events-auto scale-100"
                  : "opacity-0 pointer-events-none scale-[0.98]"
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center mb-6 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-4">
                Instant Access.
              </h3>
              <p className="text-sm text-gray-400 font-light tracking-wide mb-8 sm:mb-10 max-w-sm mx-auto leading-relaxed">
                Skip the forms. Connect directly with our lead strategist on WhatsApp to discuss
                your project in real-time.
              </p>

              {/* Swap 910000000000 with your real WhatsApp number */}
              <a
                href="https://wa.me/916388776067?text=Hey%20Zero%20Gravity%20team!%20I'd%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => posthog?.capture("Opened WhatsApp ChatLink")}
                className="group relative w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-[11px] md:text-xs rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-[1.02] active:scale-95 flex justify-center items-center min-h-[52px]"
              >
                <span className="relative flex items-center justify-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Open WhatsApp Chat
                  <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ml-1">
                    ↗
                  </span>
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