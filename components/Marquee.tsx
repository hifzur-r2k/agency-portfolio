"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

// Modulo wrap helper so the marquee loops infinitely from -50% to 0% without ever jumping
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxRowProps {
  words: string[];
  baseVelocity: number;
  outlined?: boolean;
}

function ParallaxTextRow({ words, baseVelocity, outlined = false }: ParallaxRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Maps user scroll speed into a multiplier for the marquee speed
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  const directionFactor = useRef<number>(1);
  const isHovered = useRef<boolean>(false);

  useAnimationFrame((_, delta) => {
    // Slow down gracefully when the user hovers to read or inspect
    const speedMultiplier = isHovered.current ? 0.25 : 1;
    let moveBy = directionFactor.current * baseVelocity * speedMultiplier * (delta / 1000);

    // Flip direction naturally based on whether the user scrolls up or down
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  // Loops seamlessly between -50% and 0% of the two identical flex groups
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  // Repeat words enough times per half-track to cover even 4K ultrawide monitors
  const repeatedWords = [...words, ...words, ...words, ...words];

  return (
    <div
      onMouseEnter={() => {
        isHovered.current = true;
      }}
      onMouseLeave={() => {
        isHovered.current = false;
      }}
      className="w-full overflow-hidden flex whitespace-nowrap select-none py-1 sm:py-2"
    >
      <motion.div className="flex whitespace-nowrap w-max will-change-transform" style={{ x }}>
        {[0, 1].map((groupIndex) => (
          <div key={groupIndex} className="flex items-center shrink-0">
            {repeatedWords.map((word, idx) => (
              <div key={idx} className="flex items-center">
                <span
                  className={`text-[clamp(2.75rem,8vw,7.5rem)] font-black uppercase tracking-tighter leading-[0.95] transition-all duration-500 px-3 sm:px-6 ${
                    outlined
                      ? "text-transparent hover:text-white [-webkit-text-stroke:1px_rgba(255,255,255,0.28)] sm:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.32)] md:[-webkit-text-stroke:2px_rgba(255,255,255,0.35)] hover:[-webkit-text-stroke:1px_#ffffff] hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {word}
                </span>

                {/* Rotating 4-Point Architectural Star */}
                <span
                  aria-hidden="true"
                  className={`inline-flex items-center justify-center mx-2 sm:mx-4 text-lg sm:text-2xl md:text-4xl animate-[spin_12s_linear_infinite] ${
                    outlined ? "text-white/20" : "text-amber-500/70"
                  }`}
                >
                  ✦
                </span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="relative w-full py-16 sm:py-24 md:py-32 bg-[#050505] border-t border-white/10 overflow-hidden flex flex-col justify-center">
      {/* Subtle Ambient Center Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />

      {/* Edge-Masked Kinetic Ribbon (Softly fades left & right edges into #050505) */}
      <div className="relative w-full flex flex-col gap-2 sm:gap-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* ROW 1: Solid Text Moving Left */}
        <ParallaxTextRow
          words={["INNOVATE", "CREATE", "ELEVATE"]}
          baseVelocity={-2.2}
          outlined={false}
        />

        {/* ROW 2: Outlined Stroke Text Moving Right (Illuminates on Hover) */}
        <ParallaxTextRow
          words={["ASTONISH", "INSPIRE", "CONVERT"]}
          baseVelocity={2.2}
          outlined={true}
        />
      </div>
    </section>
  );
}