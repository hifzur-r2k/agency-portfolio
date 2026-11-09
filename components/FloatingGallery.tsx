"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getPortfolioImages } from "@/app/admin/studio/actions";

// The Fallback Constellation
const fallbackImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", top: "12%", left: "68%", width: "w-[35vw] md:w-[20vw]", speed: 0.15, depth: 30, aspect: "aspect-[4/5]" },
  { id: 2, src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop", top: "8%", left: "40%", width: "w-[28vw] md:w-[15vw]", speed: 0.1, depth: 20, aspect: "aspect-[4/5]" },
  { id: 3, src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop", top: "30%", left: "4%", width: "w-[35vw] md:w-[22vw]", speed: -0.05, depth: 10, aspect: "aspect-[4/5]" },
  { id: 4, src: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop", top: "18%", left: "22%", width: "w-[25vw] md:w-[12vw]", speed: -0.15, depth: -25, aspect: "aspect-[4/5]" },
  { id: 5, src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", top: "72%", left: "32%", width: "w-[28vw] md:w-[14vw]", speed: 0.05, depth: -10, aspect: "aspect-[4/5]" },
  { id: 6, src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop", top: "62%", left: "12%", width: "w-[22vw] md:w-[10vw]", speed: 0.2, depth: 50, aspect: "aspect-[9/16]" },
  { id: 7, src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", top: "55%", left: "78%", width: "w-[30vw] md:w-[18vw]", speed: -0.1, depth: -35, aspect: "aspect-[4/5]" },
  { id: 8, src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop", top: "78%", left: "55%", width: "w-[28vw] md:w-[16vw]", speed: 0.12, depth: 15, aspect: "aspect-[4/5]" }
];

const getAspectRatioCSS = (aspectClass: string) => {
  if (!aspectClass) return '4 / 5';
  if (aspectClass === 'aspect-square') return '1 / 1';
  if (aspectClass === 'aspect-video') return '16 / 9';
  const match = aspectClass.match(/aspect-\[(.+)\]/);
  return match ? match[1].replace('/', ' / ') : '4 / 5';
};

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
    scale: 0.95
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100,
    scale: 0.95
  })
};

function FloatingCard({ imageGroup, scrollYProgress, smoothMouseX, smoothMouseY, windowHeight, hoveredId, setHoveredId, onExpand }: any) {
  const height = windowHeight || 1000;

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (imageGroup.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageGroup.length);
    }, 3500); 
    return () => clearInterval(interval);
  }, [imageGroup.length]);

  const baseImg = imageGroup[0];
  const currentImg = imageGroup[currentIndex];
  const groupId = baseImg.id;

  const top = baseImg.top_pos || baseImg.top;
  const left = baseImg.left_pos || baseImg.left;
  const width = baseImg.width_class || baseImg.width;
  const aspect = baseImg.aspect_ratio || baseImg.aspect || "aspect-[4/5]";
  const speed = Number(baseImg.speed);
  const depth = Number(baseImg.depth);

  const yScroll = useTransform(scrollYProgress, [0, 1], [0, height * speed]);
  const xMouse = useTransform(smoothMouseX, [-1, 1], [-depth, depth]);
  const yMouse = useTransform(smoothMouseY, [-1, 1], [-depth, depth]);
  const rotateX = useTransform(smoothMouseY, [-1, 1], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-5, 5]);

  const isHovered = hoveredId === groupId;
  const isOtherHovered = hoveredId !== null && hoveredId !== groupId;

  // LONG PRESS LOGIC (MOBILE)
  const handleTouchStart = () => {
    touchTimer.current = setTimeout(() => {
      onExpand(imageGroup, currentIndex);
    }, 600);
  };

  const cancelTouch = () => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
  };

  return (
    <motion.div
      onMouseEnter={() => setHoveredId(groupId)}
      onMouseLeave={() => setHoveredId(null)}
      onDoubleClick={() => onExpand(imageGroup, currentIndex)}
      onTouchStart={handleTouchStart}
      onTouchEnd={cancelTouch}
      onTouchMove={cancelTouch}
      onTouchCancel={cancelTouch}
      // Prevents mobile browser's native "Save Image" popup from canceling the long-press
      onContextMenu={(e) => e.preventDefault()}
      className={`absolute ${width} rounded-xl overflow-hidden border border-white/10 pointer-events-auto select-none [-webkit-touch-callout:none] transition-all duration-500 ease-out ${
        isHovered
          ? 'z-50 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
          : isOtherHovered
          ? 'z-10 opacity-60'
          : 'z-20 opacity-100 shadow-2xl scale-100'
      }`}
      style={{
        top, left, y: yScroll, x: xMouse, rotateX, rotateY, transformStyle: "preserve-3d",
        aspectRatio: getAspectRatioCSS(aspect)
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentImg.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={currentImg.src}
            alt="Portfolio Item"
            fill
            draggable={false}
            className={`object-cover transition-all duration-500 ease-out ${isHovered ? 'grayscale-0' : 'grayscale'}`}
            sizes="(max-width: 768px) 50vw, 30vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className={`absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />

      {imageGroup.length > 1 && (
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-40 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          {imageGroup.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-white/30 scale-100'}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function FloatingGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [dbImages, setDbImages] = useState<any[]>([]);

  // EXPANDED MODAL STATES
  const [expandedGroup, setExpandedGroup] = useState<any[] | null>(null);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0); 

  useEffect(() => {
    async function loadImages() {
      const images = await getPortfolioImages();
      if (images && images.length > 0) {
        setDbImages(images);
      }
    }
    loadImages();
  }, []);

  const displayImages = dbImages.length > 0 ? dbImages : fallbackImages;

  const groupedImages = Object.values(
    displayImages.reduce((acc: any, img: any) => {
      const key = `${img.top_pos || img.top}_${img.left_pos || img.left}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(img);
      return acc;
    }, {})
  ) as any[][];

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // EXPAND MODAL HANDLERS
  const handleExpand = useCallback((group: any[], index: number) => {
    setExpandedGroup(group);
    setExpandedIndex(index);
    setSlideDirection(0);
  }, []);

  const closeExpanded = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    setExpandedGroup(null);
  }, []);

  const nextSlide = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (expandedGroup) {
      setSlideDirection(1);
      setExpandedIndex((prev) => (prev + 1) % expandedGroup.length);
    }
  }, [expandedGroup]);

  const prevSlide = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (expandedGroup) {
      setSlideDirection(-1);
      setExpandedIndex((prev) => (prev - 1 + expandedGroup.length) % expandedGroup.length);
    }
  }, [expandedGroup]);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (expandedGroup) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeExpanded();
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [expandedGroup, nextSlide, prevSlide, closeExpanded]);

  return (
    <section ref={containerRef} className="relative w-full h-[120vh] md:h-[150vh] bg-[#050505] overflow-hidden flex items-center justify-center">
      
      {/* HERO TEXT */}
      <div 
        className={`relative z-20 flex flex-col items-center text-center pointer-events-none transition-all duration-700 ease-out ${
          hoveredId !== null || expandedGroup !== null ? 'opacity-20 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Proven
        </h2>
        <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-orange-500 to-orange-900 drop-shadow-[0_0_30px_rgba(249,115,22,0.2)]">
          Impact
        </h2>
        <p className="mt-8 text-sm md:text-base font-mono uppercase tracking-widest max-w-xs md:max-w-xl text-gray-300">
          Award-winning digital experiences engineered to elevate your brand and build unstoppable trust.
        </p>
      </div>  

      {/* FLOATING IMAGES LAYER */}
      <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 ${expandedGroup ? 'opacity-0' : 'opacity-100'}`}>
        {groupedImages.map((group, index) => (
          <FloatingCard
            key={`group-${index}`}
            imageGroup={group}
            scrollYProgress={scrollYProgress}
            smoothMouseX={smoothMouseX}
            smoothMouseY={smoothMouseY}
            windowHeight={windowHeight}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            onExpand={handleExpand}
          />
        ))}
      </div>

      {/* EXPANDED LIGHTBOX MODAL WITH SWIPE */}
      <AnimatePresence>
        {expandedGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeExpanded}
            // FIX 1: Raised z-index from z-[100] to z-[10000000] so it sits ABOVE the z-[999999] Navbar on mobile
            className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 touch-none"
          >
            {/* CLOSE BUTTON - Added onTouchEnd + larger hit target so mobile taps never miss */}
            <button
              type="button"
              onClick={closeExpanded}
              onTouchEnd={closeExpanded}
              aria-label="Close expanded image"
              className="absolute top-6 right-6 md:top-10 md:right-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white flex items-center justify-center transition-all z-[60] backdrop-blur-md cursor-pointer pointer-events-auto"
            >
              ✕
            </button>

            {/* PREV ARROW */}
            {expandedGroup.length > 1 && (
              <button
                type="button"
                onClick={prevSlide}
                onTouchEnd={prevSlide}
                aria-label="Previous image"
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white flex items-center justify-center transition-all z-[60] backdrop-blur-md cursor-pointer pointer-events-auto"
              >
                ←
              </button>
            )}

            {/* SWIPEABLE IMAGE CONTAINER */}
            <div className="relative w-full max-w-5xl h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden pointer-events-none">
              <AnimatePresence mode="popLayout" custom={slideDirection}>
                <motion.img
                  key={expandedIndex}
                  custom={slideDirection}
                  src={expandedGroup[expandedIndex].src}
                  alt="Expanded View"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  drag={expandedGroup.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => e.stopPropagation()} 
                  className="absolute w-auto h-auto max-w-full max-h-full object-contain rounded-xl cursor-grab active:cursor-grabbing pointer-events-auto"
                />
              </AnimatePresence>
            </div>

            {/* NEXT ARROW */}
            {expandedGroup.length > 1 && (
              <button
                type="button"
                onClick={nextSlide}
                onTouchEnd={nextSlide}
                aria-label="Next image"
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white flex items-center justify-center transition-all z-[60] backdrop-blur-md cursor-pointer pointer-events-auto"
              >
                →
              </button>
            )}

            {/* DOT INDICATORS (BOTTOM) */}
            {expandedGroup.length > 1 && (
              <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5 z-[60] bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
                {expandedGroup.map((_: any, idx: number) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setSlideDirection(idx > expandedIndex ? 1 : -1); setExpandedIndex(idx); }}
                    onTouchEnd={(e) => { e.stopPropagation(); setSlideDirection(idx > expandedIndex ? 1 : -1); setExpandedIndex(idx); }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === expandedIndex ? "w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}