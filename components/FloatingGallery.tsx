"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

// 1. The Fallback Constellation (Keeps your site looking AAA while you build your DB)
const fallbackImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", top: "12%", left: "68%", width: "w-[35vw] md:w-[20vw]", speed: 0.15, depth: 30 },
  { id: 2, src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop", top: "8%", left: "40%", width: "w-[28vw] md:w-[15vw]", speed: 0.1, depth: 20 },
  { id: 3, src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop", top: "30%", left: "4%", width: "w-[35vw] md:w-[22vw]", speed: -0.05, depth: 10 },
  { id: 4, src: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop", top: "18%", left: "22%", width: "w-[25vw] md:w-[12vw]", speed: -0.15, depth: -25 },
  { id: 5, src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", top: "72%", left: "32%", width: "w-[28vw] md:w-[14vw]", speed: 0.05, depth: -10 },
  { id: 6, src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop", top: "62%", left: "12%", width: "w-[22vw] md:w-[10vw]", speed: 0.2, depth: 50, aspect: "aspect-[9/16]" },
  { id: 7, src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", top: "55%", left: "78%", width: "w-[30vw] md:w-[18vw]", speed: -0.1, depth: -35 },
  { id: 8, src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop", top: "78%", left: "55%", width: "w-[28vw] md:w-[16vw]", speed: 0.12, depth: 15 }
];

function FloatingCard({ img, scrollYProgress, smoothMouseX, smoothMouseY, windowHeight, hoveredId, setHoveredId }: any) {
  const height = windowHeight || 1000; 
  
  // 2. Data Bridge: Intelligently uses either DB columns (top_pos) or Fallback keys (top)
  const top = img.top_pos || img.top;
  const left = img.left_pos || img.left;
  const width = img.width_class || img.width;
  const aspect = img.aspect_ratio || img.aspect || "aspect-[4/5]";
  const speed = Number(img.speed);
  const depth = Number(img.depth);

  const yScroll = useTransform(scrollYProgress, [0, 1], [0, height * speed]);
  const xMouse = useTransform(smoothMouseX, [-1, 1], [-depth, depth]);
  const yMouse = useTransform(smoothMouseY, [-1, 1], [-depth, depth]);
  const rotateX = useTransform(smoothMouseY, [-1, 1], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-5, 5]);
  
  const isHovered = hoveredId === img.id;
  const isOtherHovered = hoveredId !== null && hoveredId !== img.id;

  return (
    <motion.div
      onMouseEnter={() => setHoveredId(img.id)}
      onMouseLeave={() => setHoveredId(null)}
      className={`absolute ${width} ${aspect} rounded-xl overflow-hidden border border-white/10 pointer-events-auto transition-all duration-500 ease-out ${
        isHovered ? 'z-50 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 
        isOtherHovered ? 'z-10 opacity-60' : 
        'z-20 opacity-100 shadow-2xl scale-100'
      }`}
      style={{
        top, left, y: yScroll, x: xMouse, rotateX, rotateY, transformStyle: "preserve-3d",
      }}
    >
      <Image
        src={img.src}
        alt="Portfolio Item"
        fill
        className={`object-cover transition-all duration-500 ease-out ${isHovered ? 'grayscale-0' : 'grayscale'}`}
        sizes="(max-width: 768px) 50vw, 30vw"
      />
      <div className={`absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
    </motion.div>
  );
}

// 1. Import your new server action at the very top of the file!
import { getPortfolioImages } from "@/app/admin/studio/actions";

export default function FloatingGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  // 2. Add state to hold your live database images
  const [dbImages, setDbImages] = useState<any[]>([]);

  // 3. Fetch the images securely when the component loads
  useEffect(() => {
    async function loadImages() {
      const images = await getPortfolioImages();
      if (images && images.length > 0) {
        setDbImages(images);
      }
    }
    loadImages();
  }, []);

  // 4. Use the database images if they exist, otherwise use the beautiful fallback
  const displayImages = dbImages.length > 0 ? dbImages : fallbackImages;

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

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[120vh] md:h-[150vh] bg-[#050505] overflow-hidden flex items-center justify-center"
    >
      <div className="relative z-20 flex flex-col items-center text-center pointer-events-none">
        <h2 className={`text-5xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none transition-opacity duration-500 ease-out text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${hoveredId !== null ? 'opacity-20' : 'opacity-100'}`}>
          Proven
        </h2>
        <h2 className={`text-5xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none transition-opacity duration-500 ease-out text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)] ${hoveredId !== null ? 'opacity-30' : 'opacity-100'}`}>
          Impact
        </h2>
        <p className={`mt-8 text-sm md:text-base font-mono uppercase tracking-widest max-w-xs md:max-w-xl transition-colors duration-500 ease-out ${hoveredId !== null ? 'text-gray-600' : 'text-gray-300'}`}>
          Award-winning digital experiences engineered to elevate your brand and build unstoppable trust.
        </p>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {displayImages.map((img) => (
          <FloatingCard 
            key={img.id} 
            img={img} 
            scrollYProgress={scrollYProgress} 
            smoothMouseX={smoothMouseX} 
            smoothMouseY={smoothMouseY} 
            windowHeight={windowHeight}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />
        ))}
      </div>
    </section>
  );
}