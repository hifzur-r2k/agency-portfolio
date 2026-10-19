"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const words = [
  "#Digital Marketing",
  "#Video Production",
  "#Graphic Design",
  "#Web & App Dev",
];

export default function Typewriter() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // --- BARREL ROLL SCROLL ANIMATIONS ---
  const { scrollY } = useScroll();
  
  // 1. Fades out
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // 2. Floats upwards 100 pixels
  const y = useTransform(scrollY, [0, 300], [0, -100]);
  
  // 3. THE ROLL: Spins 180 degrees counter-clockwise
  const rotate = useTransform(scrollY, [0, 300], [0, -180]);
  
  // 4. Shrinks down to 30% of its size as it spins away
  const scale = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorTimeout = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(cursorTimeout);
  }, [blink]);

  // Typing and erasing logic
  useEffect(() => {
    if (index === words.length) {
      setIndex(0);
      return;
    }

    if (subIndex === words[index].length + 1 && !isDeleting) {
      const pauseTimeout = setTimeout(() => setIsDeleting(true), 2000); 
      return () => clearTimeout(pauseTimeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const typingTimeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 50 : 100); 

    return () => clearTimeout(typingTimeout);
  }, [subIndex, index, isDeleting]);

  return (
    <motion.div
      style={{
        opacity,
        y,
        rotate, // Applies the spinning effect
        scale,
        transformOrigin: "center center", // Ensures it spins perfectly from its own center
      }}
      className="absolute top-10 left-10 z-50 text-gray-400 font-mono font-bold text-lg tracking-wide pointer-events-none"
    >
      {words[index].substring(0, subIndex)}
      <span
        className={`${
          blink ? "opacity-100" : "opacity-0"
        } transition-opacity duration-100 text-white`}
      >
        |
      </span>
    </motion.div>
  );
}