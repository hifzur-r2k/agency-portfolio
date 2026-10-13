"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, Variants } from "framer-motion";

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState<"default" | "pointer" | "view">("default");
  const [isVisible, setIsVisible] = useState(false);

  // High-performance hardware tracking (bypasses React state limits)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Buttery smooth physics
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show cursor after first mouse move to prevent jump glitches
    const handleFirstMove = () => setIsVisible(true);
    window.addEventListener("mousemove", handleFirstMove, { once: true });

    const updatePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isPortfolioCard = target.closest(".group.cursor-pointer");
      const isInteractive = target.closest("a, button, [role='button'], .pointer-events-auto, .cursor-pointer");

      if (isPortfolioCard) {
        setHoverState("view");
      } else if (isInteractive) {
        setHoverState("pointer");
      } else {
        setHoverState("default");
      }
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", updateHoverState);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", updateHoverState);
      window.removeEventListener("mousemove", handleFirstMove);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  const variants: Variants = {
    default: {
      width: 20,
      height: 20,
      backgroundColor: "#ffffff",
      border: "0px solid #ffffff",
    },
    pointer: {
      width: 60,
      height: 60,
      backgroundColor: "transparent",
      border: "2px solid #ffffff",
    },
    view: {
      width: 90,
      height: 90,
      backgroundColor: "#ffffff",
      border: "0px solid #ffffff",
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999999] hidden md:flex items-center justify-center rounded-full mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={hoverState}
      variants={variants}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {hoverState === "view" && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          // Black text inside a difference-blended white circle creates a true transparent "cutout" window effect
          className="text-black text-[10px] font-black uppercase tracking-widest"
        >
          View
        </motion.span>
      )}
    </motion.div>
  );
}