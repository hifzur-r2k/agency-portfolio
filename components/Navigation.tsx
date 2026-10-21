"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  
  // --- INTELLIGENT SCROLL HIDE LOGIC ---
  const { scrollY } = useScroll();
  const [isHidden, setIsHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // If scrolling down and past 150px, hide the nav. If scrolling up, show it.
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });
  
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const links = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Services", path: "/#services" },
  ];

  const lockScrollSpy = () => {
    isClickScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 900);
  };

  useEffect(() => {
    if (pathname !== "/") {
      setActiveHash("");
      return;
    }

    if (window.location.hash === "#services") {
      setActiveHash("#services");
      lockScrollSpy();
      setTimeout(() => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    const handleScroll = () => {
      if (isClickScrolling.current) return;
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 100) {
          setActiveHash("#services");
        } else {
          setActiveHash("");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    setIsOpen(false);

    if (path === "/#services") {
      setActiveHash("#services");
      lockScrollSpy();

      if (pathname === "/") {
        e.preventDefault();
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "/#services");
      }
    } else if (path === "/") {
      setActiveHash("");
      lockScrollSpy();

      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      }
    } else {
      setActiveHash("");
    }
  };

  const currentActivePath = pathname === "/" && activeHash === "#services" ? "/#services" : pathname;

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[999999] w-[90%] md:w-auto">
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          // Animate y to -100 to smoothly slide the pill out of view when scrolling down
          animate={{ y: isHidden ? -100 : 0, opacity: isHidden ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // AAA Apple-style easing curve
          className="flex items-center justify-between md:justify-center gap-8 px-3 py-3 rounded-full bg-[#0a0a0a]/50 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          
          {/* THE 2D/3D WIREFRAME LOGO */}
          <Link 
            href="/" 
            className="group flex items-center gap-3 pl-2" 
            onClick={(e) => handleNavClick(e, "/")}
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10 text-white flex items-center justify-center">
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full group-hover:rotate-180 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3"/>
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 6"/>
                <ellipse cx="50" cy="50" rx="48" ry="16" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" transform="rotate(30 50 50)"/>
                <ellipse cx="50" cy="50" rx="48" ry="16" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" transform="rotate(90 50 50)"/>
                <ellipse cx="50" cy="50" rx="48" ry="16" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" transform="rotate(150 50 50)"/>
                <circle cx="50" cy="50" r="6" fill="currentColor" className="animate-pulse" />
              </svg>
            </div>
            <span className="font-bold tracking-widest uppercase text-xs md:text-sm hidden md:block group-hover:text-gray-300 transition-colors">
              AGENCY
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = currentActivePath === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`relative px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors z-10 ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/20 -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          <a 
            href="#contact"
            className="hidden md:block px-6 py-3 mr-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform"
          >
            Start Project
          </a>

          {/* MOBILE HAMBURGER */}
          <button 
            className="md:hidden pr-3 flex flex-col justify-center items-end gap-[5px] w-8 h-8"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`block h-[2px] bg-white transition-all duration-500 ease-in-out ${isOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
            <span className={`block h-[2px] bg-white transition-all duration-500 ease-in-out ${isOpen ? "opacity-0 w-6" : "w-4"}`} />
            <span className={`block h-[2px] bg-white transition-all duration-500 ease-in-out ${isOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5"}`} />
          </button>
        </motion.nav>
      </header>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[999998] bg-[#050505]/95 flex flex-col items-center justify-center md:hidden"
          >
            <div className="flex flex-col items-center gap-8 text-3xl font-black uppercase tracking-widest">
              {links.map((link, i) => {
                const isActive = currentActivePath === link.path;
                return (
                  <motion.div 
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, type: "spring" }} // FIXED syntax error here
                  >
                    <Link 
                      href={link.path} 
                      onClick={(e) => handleNavClick(e, link.path)} 
                      className={`transition-colors ${isActive ? "text-white" : "text-gray-500 hover:text-white"}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.a 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                href="#contact"
                className="mt-4 px-8 py-4 rounded-full bg-white text-black text-sm font-bold shadow-xl hover:scale-105 transition-transform"
              >
                START PROJECT
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}