"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendEmail } from "@/app/actions/sendEmail";

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const wordCount = formData.message.trim() === "" ? 0 : formData.message.trim().split(/\s+/).length;

  // Handles the form reset logic smoothly
  const resetForm = () => {
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
        // If closed via browser back button, wait for animation then reset
        setTimeout(resetForm, 500);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const closeModal = () => {
    window.history.pushState(null, "", window.location.pathname);
    setIsOpen(false);
    // Explicitly wipe the form data 500ms after closing so the exit animation is smooth
    setTimeout(resetForm, 500);
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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 md:p-8">
          
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={closeModal}
            className="absolute inset-0 bg-[#020202]/70"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-[#080808] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-white/[0.04] blur-[120px] rounded-full" />
              <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-white/[0.03] blur-[100px] rounded-full" />
            </div>

            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors p-2 z-50 bg-black/20 hover:bg-white/10 rounded-full backdrop-blur-md"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center w-full min-h-[500px] p-8 relative z-10"
                >
                  <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  {/* Updated the Success Copy here */}
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
                    Message<br/>Sent.
                  </h3>
                  <p className="text-gray-400 font-mono text-sm tracking-widest uppercase max-w-md mx-auto leading-relaxed">
                    We review every inquiry personally. Our team will contact you shortly.
                  </p>
                </motion.div>
              ) : (
                
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col md:flex-row w-full relative z-10"
                >
                  
                  <div className="w-full md:w-5/12 bg-white/[0.01] p-8 md:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 backdrop-blur-sm">
                    <div>
                      <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-6">
                        Let's<br/>
                        <span className="text-white/30">Talk.</span>
                      </h3>
                      <p className="text-gray-400 font-medium text-sm md:text-base leading-relaxed max-w-[90%]">
                        Every great digital experience begins with a conversation. Share your vision, and let's craft something extraordinary together.
                      </p>
                    </div>

                    <div className="mt-12 md:mt-0 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Direct Channel</p>
                        <a href="mailto:contact.zerogravityspace@gmail.com" className="text-white/80 hover:text-white transition-colors font-mono text-xs tracking-wide block">
                          contact.zerogravityspace@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-7/12 p-8 md:p-14">
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 h-full justify-center">
                      
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
                            className={`w-full bg-white/[0.02] border rounded-2xl px-5 py-4 text-base font-semibold text-white focus:outline-none transition-all duration-300 placeholder:text-gray-600 disabled:opacity-50 ${errors.name ? 'border-red-500/50 focus:bg-red-500/5 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-white/40 focus:bg-white/[0.04] focus:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}`} 
                            placeholder="John Doe" 
                          />
                          {errors.name && <span className="text-red-400 text-[10px] uppercase tracking-widest ml-1">{errors.name}</span>}
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
                            className={`w-full bg-white/[0.02] border rounded-2xl px-5 py-4 text-base font-semibold text-white focus:outline-none transition-all duration-300 placeholder:text-gray-600 disabled:opacity-50 ${errors.email ? 'border-red-500/50 focus:bg-red-500/5 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-white/40 focus:bg-white/[0.04] focus:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}`} 
                            placeholder="john@example.com" 
                          />
                          {errors.email && <span className="text-red-400 text-[10px] uppercase tracking-widest ml-1">{errors.email}</span>}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex justify-between items-end ml-1 mr-1">
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Project Details</label>
                          <span className={`text-[10px] uppercase tracking-widest font-mono ${wordCount > 100 ? "text-red-400" : "text-gray-500"}`}>
                            {wordCount} / 100 words
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
                          className={`w-full bg-white/[0.02] border rounded-2xl px-5 py-4 text-base font-medium text-white focus:outline-none transition-all duration-300 resize-none placeholder:text-gray-600 disabled:opacity-50 ${errors.message ? 'border-red-500/50 focus:bg-red-500/5 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10 focus:border-white/40 focus:bg-white/[0.04] focus:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}`} 
                          placeholder="Tell us about your vision..." 
                        />
                        {errors.message && <span className="text-red-400 text-[10px] uppercase tracking-widest ml-1">{errors.message}</span>}
                      </div>

                      <button 
                        type="submit" 
                        disabled={status === "loading"}
                        className="mt-6 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 bg-white text-black hover:bg-gray-200 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center h-14 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      >
                        {/* Simplified the button text here */}
                        {status === "idle" && "Send Message"}
                        {status === "loading" && (
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        )}
                        {status === "error" && "Try Again"}
                      </button>

                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}