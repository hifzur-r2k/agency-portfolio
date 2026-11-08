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
    // Never hide the navbar if the mobile menu is currently open
    if (isOpen) {
      setIsHidden(false);
      return;
    }
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

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle hash scrolling when arriving from another page (e.g., /portfolio -> /#contact)
  useEffect(() => {
    if (pathname !== "/") {
      setActiveHash("");
      return;
    }

    const hash = window.location.hash;
    if (hash === "#services" || hash === "#contact") {
      if (hash === "#services") setActiveHash("#services");
      lockScrollSpy();
      const targetId = hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
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

  // Safe to return null here AFTER all React hooks have been called
  if (pathname?.startsWith("/admin")) return null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    setIsOpen(false);

    if (path === "/#services" || path === "/#contact") {
      const targetId = path.split("#")[1];
      setActiveHash(path === "/#services" ? "#services" : "");
      lockScrollSpy();

      if (pathname === "/") {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", path);
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

  const currentActivePath =
    pathname === "/" && activeHash === "#services" ? "/#services" : pathname;

  return (
    <>
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[999999] w-[92%] sm:w-[90%] md:w-auto max-w-[96vw]">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: isHidden && !isOpen ? -120 : 0, opacity: isHidden && !isOpen ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between md:justify-center gap-2 lg:gap-8 px-3 py-2 sm:py-2.5 rounded-full bg-[#0a0a0a]/70 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
        >
          {/* THE 2D/3D WIREFRAME LOGO */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 pl-2 py-1 shrink-0"
            onClick={(e) => handleNavClick(e, "/")}
          >
            <div className="relative w-8 h-8 md:w-9 md:h-9 text-white flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full group-hover:rotate-180 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  strokeDasharray="4 6"
                />
                <ellipse
                  cx="50"
                  cy="50"
                  rx="48"
                  ry="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                  transform="rotate(30 50 50)"
                />
                <ellipse
                  cx="50"
                  cy="50"
                  rx="48"
                  ry="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                  transform="rotate(90 50 50)"
                />
                <ellipse
                  cx="50"
                  cy="50"
                  rx="48"
                  ry="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                  transform="rotate(150 50 50)"
                />
                <circle cx="50" cy="50" r="6" fill="currentColor" className="animate-pulse" />
              </svg>
            </div>
            <span className="font-bold tracking-widest uppercase text-[11px] sm:text-xs lg:text-sm text-white group-hover:text-gray-300 transition-colors pr-1">
              AGENCY
            </span>
          </Link>

          {/* DESKTOP & TABLET LINKS */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {links.map((link) => {
              const isActive = currentActivePath === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`relative px-3.5 lg:px-5 py-2.5 text-[11px] lg:text-xs font-bold uppercase tracking-[0.18em] lg:tracking-[0.2em] transition-colors z-10 whitespace-nowrap ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
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

          {/* DESKTOP CTA BUTTON (Works from both / and /portfolio) */}
          <Link
            href="/#contact"
            onClick={(e) => handleNavClick(e, "/#contact")}
            className="hidden md:inline-flex items-center justify-center px-4 lg:px-6 py-2.5 lg:py-3 mr-0.5 rounded-full bg-white text-black text-[10px] lg:text-xs font-bold uppercase tracking-[0.18em] lg:tracking-[0.2em] hover:scale-105 transition-transform whitespace-nowrap shrink-0"
          >
            Start Project
          </Link>

          {/* MOBILE HAMBURGER (44x44px minimum touch target for Fitts's Law) */}
          <button
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isOpen}
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-11 h-11 rounded-full hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`block h-[2px] bg-white transition-all duration-300 ease-in-out ${
                isOpen ? "w-5 rotate-45 translate-y-[7px]" : "w-5"
              }`}
            />
            <span
              className={`block h-[2px] bg-white transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-0 w-5" : "w-3.5 translate-x-0.5"
              }`}
            />
            <span
              className={`block h-[2px] bg-white transition-all duration-300 ease-in-out ${
                isOpen ? "w-5 -rotate-45 -translate-y-[7px]" : "w-4"
              }`}
            />
          </button>
        </motion.nav>
      </header>

      {/* MOBILE FULL-SCREEN MENU (100dvh safe for mobile browsers & foldables) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 h-[100dvh] z-[999998] bg-[#050505]/95 flex flex-col items-center justify-center px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-6 sm:gap-8 text-2xl sm:text-3xl font-black uppercase tracking-widest text-center">
              {links.map((link, i) => {
                const isActive = currentActivePath === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i, type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <Link
                      href={link.path}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className={`block py-2 px-4 transition-colors ${
                        isActive ? "text-white" : "text-gray-500 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 24 }}
              >
                <Link
                  href="/#contact"
                  onClick={(e) => handleNavClick(e, "/#contact")}
                  className="mt-4 inline-block px-8 py-4 rounded-full bg-white text-black text-xs sm:text-sm font-bold tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition-transform"
                >
                  START PROJECT
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}