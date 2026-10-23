"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendEmail } from "@/app/actions/sendEmail";

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  // UI Routing State (selection -> message OR calendar)
  const [view, setView] = useState<"selection" | "message" | "calendar">("selection");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const wordCount = formData.message.trim() === "" ? 0 : formData.message.trim().split(/\s+/).length;

  const resetState = () => {
    setView("selection");
    setStatus("idle");
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#contact") {
        setIsOpen(true);
      } else {
        setIsOpen(false);
        setTimeout(resetState, 500);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const closeModal = () => {
    window.history.pushState(null, "", window.location.pathname);
    setIsOpen(false);
    setTimeout(resetState, 500);
  };

  const validateForm = () => {
    const newErrors: any = {};
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
        setTimeout(() => closeModal(), 5000);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus("error");
      setErrors({ message: "Server connection failed. Please try again." });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-3 md:p-8">
          
          {/* Heavy Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={closeModal}
            className="absolute inset-0 bg-[#020202]/80"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-[#080808] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex flex-col"
          >
            
            {/* Global Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-5 right-5 md:top-8 md:right-8 text-white/30 hover:text-white transition-colors p-2 z-50 bg-black/20 hover:bg-white/10 rounded-full backdrop-blur-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Back Button (Only shows when deep in a view) */}
            <AnimatePresence>
              {view !== "selection" && status !== "success" && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setView("selection")}
                  className="absolute top-5 left-5 md:top-8 md:left-8 text-white/50 hover:text-white transition-colors p-2 z-50 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative min-h-[500px]">
              <AnimatePresence mode="wait">
                
                {/* ----------------------------- */}
                {/* VIEW 1: THE SELECTION HUB       */}
                {/* ----------------------------- */}
                {view === "selection" && (
                  <motion.div
                    key="selection"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center text-center p-8 md:p-16 w-full"
                  >
                    <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
                      Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">Connect.</span>
                    </h3>
                    <p className="text-gray-400 font-medium text-sm md:text-base mb-12 max-w-md">
                      Choose how you'd like to reach out. Book a live strategy call, or drop us a detailed message.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
                      {/* Option A: Calendar */}
                      <button 
                        onClick={() => setView("calendar")}
                        className="group relative flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white/[0.02] border border-white/10 rounded-3xl hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500" />
                        <div className="w-14 h-14 bg-white/[0.05] rounded-full flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Book a Call</h4>
                        <p className="text-xs text-gray-500">Schedule a 30-min discovery session via Google Meet.</p>
                      </button>

                      {/* Option B: Message */}
                      <button 
                        onClick={() => setView("message")}
                        className="group relative flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white/[0.02] border border-white/10 rounded-3xl hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 overflow-hidden"
                      >
                        <div className="w-14 h-14 bg-white/[0.05] rounded-full flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Send Message</h4>
                        <p className="text-xs text-gray-500">Share your vision and project details directly.</p>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ----------------------------- */}
                {/* VIEW 2: FULL-WIDTH CALENDAR     */}
                {/* ----------------------------- */}
                {view === "calendar" && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    // FIXED: Added flex flex-col to force the iframe to stretch properly
                    className="w-full h-full flex flex-col flex-1 pt-16 md:pt-20 px-2 md:px-4 pb-4"
                  >
                    <iframe 
                      src="https://cal.com/zero-gravity-l7pwsp/30min?theme=dark" 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      // FIXED: Placed strict min-height boundaries directly onto the iframe
                      className="w-full flex-1 min-h-[600px] md:min-h-[700px] rounded-2xl"
                      title="Schedule a Discovery Call"
                    />
                  </motion.div>
                )}

                {/* ----------------------------- */}
                {/* VIEW 3: FULL-WIDTH FORM         */}
                {/* ----------------------------- */}
                {view === "message" && status !== "success" && (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex items-center justify-center p-6 pt-20 md:p-16"
                  >
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 w-full max-w-xl mx-auto">
                      <div className="text-center mb-4">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Project Details</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">We respond within 24 hours.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Your Name</label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (errors.name) setErrors({ ...errors, name: "" });
                            }}
                            disabled={status === "loading"}
                            className={`w-full bg-white/[0.02] border rounded-2xl px-5 py-4 text-base font-semibold text-white focus:outline-none transition-all duration-300 placeholder:text-gray-600 disabled:opacity-50 ${errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-white/40'}`} 
                            placeholder="John Doe" 
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Email Address</label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              if (errors.email) setErrors({ ...errors, email: "" });
                            }}
                            disabled={status === "loading"}
                            className={`w-full bg-white/[0.02] border rounded-2xl px-5 py-4 text-base font-semibold text-white focus:outline-none transition-all duration-300 placeholder:text-gray-600 disabled:opacity-50 ${errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-white/40'}`} 
                            placeholder="john@example.com" 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end ml-1 mr-1">
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Project Vision</label>
                          <span className={`text-[10px] uppercase tracking-widest font-mono ${wordCount > 100 ? "text-red-400" : "text-gray-500"}`}>
                            {wordCount} / 100
                          </span>
                        </div>
                        <textarea 
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (errors.message) setErrors({ ...errors, message: "" });
                          }}
                          disabled={status === "loading"}
                          rows={4}
                          className={`w-full bg-white/[0.02] border rounded-2xl px-5 py-4 text-base font-medium text-white focus:outline-none transition-all duration-300 resize-none placeholder:text-gray-600 disabled:opacity-50 ${errors.message ? 'border-red-500/50' : 'border-white/10 focus:border-white/40'}`} 
                          placeholder="Tell us what you're building..." 
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={status === "loading"}
                        className="mt-2 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 bg-white text-black hover:bg-gray-200 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center h-14"
                      >
                        {status === "idle" && "Send Message"}
                        {status === "loading" && <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
                        {status === "error" && "Try Again"}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ----------------------------- */}
                {/* VIEW 4: SUCCESS SCREEN          */}
                {/* ----------------------------- */}
                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center text-center w-full p-8"
                  >
                    <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">Message Sent.</h3>
                    <p className="text-gray-400 font-mono text-xs tracking-widest uppercase max-w-sm">We'll be in touch shortly.</p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}