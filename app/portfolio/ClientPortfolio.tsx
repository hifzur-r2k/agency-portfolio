"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  "All",
  "Digital Marketing",
  "Video Production",
  "Graphic Design",
  "Web & App Dev",
] as const;

type Category = (typeof CATEGORIES)[number];

interface Project {
  id: number;
  title: string;
  category: Exclude<Category, "All">;
  impact: string;
  deliverables: string[];
  images: string[];
  description: string;
  liveUrl?: string;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Urban Architecture",
    category: "Web & App Dev",
    impact: "↗ +185% Lead Inquiries",
    deliverables: ["3D WebGL Experience", "Next.js Architecture", "CMS Integration"],
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "A complete digital overhaul for a premier architectural firm. We built a 3D-heavy WebGL portfolio that allows users to explore building models in real-time right from their browser.",
    liveUrl: "#",
  },
  {
    id: 2,
    title: "Aura Skincare",
    category: "Digital Marketing",
    impact: "↗ +300% Q4 Sales",
    deliverables: ["Meta & Google Ads", "Conversion Funnel", "Product Direction"],
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608248597359-0e6d526a6828?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "A high-converting e-commerce campaign resulting in a 300% increase in Q4 sales. We handled everything from the initial product photography to the targeted social media ad rollout.",
    liveUrl: "#",
  },
];

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || !project.images || project.images.length <= 1) {
      setCurrentSlide(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % project.images.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [isHovered, project.images]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      onClick={() => onSelect(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col gap-4"
    >
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-[#0a0a0a] border border-white/10 group-hover:border-white/30 transition-colors">
        {project.images?.map((imgUrl, idx) => (
          <img
            key={idx}
            src={imgUrl}
            alt={`${project.title} slide ${idx + 1}`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              idx === currentSlide
                ? "opacity-85 group-hover:opacity-100 group-hover:scale-105 z-10"
                : "opacity-0 scale-100 z-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity z-20 pointer-events-none" />

        {/* Visible on mobile/tablet by default, hover-animated on desktop */}
        <div className="absolute top-4 left-4 z-30 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-widest text-white opacity-100 translate-y-0 lg:opacity-0 lg:-translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300">
          {project.impact}
        </div>

        <div className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-widest opacity-100 translate-y-0 lg:opacity-0 lg:-translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300">
          Explore Case ↗
        </div>

        {project.images && project.images.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
            <div className="flex gap-1.5">
              {project.images.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    dotIdx === currentSlide ? "w-5 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
            <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-300">
              {currentSlide + 1} / {project.images.length} Shots
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center border-b border-white/10 pb-4 group-hover:border-white/50 transition-colors duration-500">
        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-500 group-hover:text-gray-300 uppercase tracking-widest text-[10px] md:text-xs font-bold transition-colors">
          {project.category}
        </p>
      </div>
    </motion.div>
  );
}

function PortfolioContent({ initialProjects }: { initialProjects: Project[] }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Refs for smooth programmatic image scrolling inside the modal
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [dbProjects] = useState<Project[]>(
    initialProjects && initialProjects.length > 0 ? initialProjects : FALLBACK_PROJECTS
  );

  useEffect(() => {
    const param = searchParams.get("category");
    if (param && CATEGORIES.includes(param as Category)) {
      setActiveCategory(param as Category);
    }
  }, [searchParams]);

  // Jump to a specific image inside the modal
  const scrollToImage = (idx: number) => {
    if (!selectedProject?.images) return;
    const bounded = Math.max(0, Math.min(idx, selectedProject.images.length - 1));
    setActiveImageIndex(bounded);
    imageRefs.current[bounded]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // Track which image is currently in view as the user scrolls with mouse wheel
  const handleGalleryScroll = () => {
    const container = galleryScrollRef.current;
    if (!container || !selectedProject?.images) return;
    const scrollPos = container.scrollTop + container.clientHeight * 0.35;

    for (let i = 0; i < selectedProject.images.length; i++) {
      const el = imageRefs.current[i];
      if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
        setActiveImageIndex(i);
        break;
      }
    }
  };

  // Lock BOTH html and body scroll + add keyboard navigation when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        scrollToImage(activeImageIndex + 1);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToImage(activeImageIndex - 1);
      }
    };

    if (selectedProject) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      setActiveImageIndex(0);
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject, activeImageIndex]);

  const filteredProjects =
    activeCategory === "All"
      ? dbProjects
      : dbProjects.filter((p) => p.category === activeCategory);

  const getCategoryCount = (cat: Category) =>
    cat === "All"
      ? dbProjects.length
      : dbProjects.filter((p) => p.category === cat).length;

  const hasValidLiveUrl =
    selectedProject?.liveUrl &&
    selectedProject.liveUrl.trim() !== "" &&
    selectedProject.liveUrl.trim() !== "#";

  return (
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA] pt-32 pb-24 px-6 md:px-12 relative z-10">
      {/* Sleek Dark Custom Scrollbar for the Modal */}
      <style>{`
        .modal-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scroll::-webkit-scrollbar-track {
          background: #050505;
        }
        .modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }
        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-gray-500 hover:text-white transition-colors mb-10 inline-block uppercase tracking-widest text-xs font-bold"
        >
          ← Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 border-b border-white/10 pb-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]"
          >
            Selected <br />
            <span className="text-gray-500">Works</span>
          </motion.h1>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {category}{" "}
                  <span
                    className={`ml-1 text-[9px] ${
                      isActive ? "text-black/60" : "text-gray-600"
                    }`}
                  >
                    ({getCategoryCount(category)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onSelect={(p) => {
                  setActiveImageIndex(0);
                  setSelectedProject(p);
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
              Ready to scale your brand?
            </p>
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
              Seen enough proof? Let&apos;s build yours next.
            </h3>
          </div>
          <Link
            href="/#contact"
            className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform whitespace-nowrap"
          >
            Start a Project ↗
          </Link>
        </div>
      </div>

      {/* CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            // FIX 1: z-[10000000] sits above the z-[999999] Navbar.
            // FIX 2: data-lenis-prevent + onWheel stopPropagation stops SmoothScroll from scrolling the background!
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 md:p-10"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0a0a0a] border border-white/15 w-full max-w-6xl rounded-2xl overflow-hidden max-h-[90dvh] flex flex-col md:flex-row shadow-2xl"
            >
              {/* TOP-RIGHT CLOSE BUTTON (Always pinned to top-right on both mobile and desktop) */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 rounded-full bg-black/70 md:bg-white/5 hover:bg-white/20 border border-white/15 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer backdrop-blur-md"
              >
                ✕
              </button>

              {/* LEFT COLUMN: Scrollable Image Feed + Floating Quick-Jump Controls */}
              <div className="relative w-full md:w-3/5 flex flex-col bg-[#050505] border-b md:border-b-0 md:border-r border-white/10 max-h-[52dvh] md:max-h-[90dvh]">
                <div
                  ref={galleryScrollRef}
                  onScroll={handleGalleryScroll}
                  data-lenis-prevent="true"
                  className="modal-scroll w-full h-full overflow-y-auto overscroll-contain p-4 md:p-6 space-y-4 scroll-smooth"
                >
                  {selectedProject.images?.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      ref={(el) => {
                        imageRefs.current[idx] = el;
                      }}
                      className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]"
                    >
                      <img
                        src={imgUrl}
                        alt={`${selectedProject.title} visual ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-auto object-cover"
                      />
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-gray-200 border border-white/10">
                        {String(idx + 1).padStart(2, "0")} /{" "}
                        {String(selectedProject.images.length).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* FLOATING GALLERY NAVIGATION BAR (Click to jump or step through images) */}
                {selectedProject.images && selectedProject.images.length > 1 && (
                  <div className="sticky bottom-3 left-0 right-0 mx-auto w-max z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl mb-2">
                    <button
                      type="button"
                      onClick={() => scrollToImage(activeImageIndex - 1)}
                      disabled={activeImageIndex === 0}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/20 disabled:opacity-30 text-white text-xs flex items-center justify-center transition-colors cursor-pointer"
                      title="Previous Image"
                    >
                      ↑
                    </button>

                    <div className="flex items-center gap-1 px-1">
                      {selectedProject.images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => scrollToImage(idx)}
                          className={`px-2 py-1 rounded-full font-mono text-[10px] transition-all cursor-pointer ${
                            activeImageIndex === idx
                              ? "bg-white text-black font-bold"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          0{idx + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollToImage(activeImageIndex + 1)}
                      disabled={activeImageIndex === selectedProject.images.length - 1}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/20 disabled:opacity-30 text-white text-xs flex items-center justify-center transition-colors cursor-pointer"
                      title="Next Image"
                    >
                      ↓
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Project Details */}
              <div
                data-lenis-prevent="true"
                className="modal-scroll w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-between relative overflow-y-auto overscroll-contain max-h-[38dvh] md:max-h-[90dvh]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4 pr-10">
                    <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                      {selectedProject.category}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-amber-400 font-mono text-[10px] uppercase tracking-wider">
                      {selectedProject.impact}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.95]">
                    {selectedProject.title}
                  </h2>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                    <div className="mb-8">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-3">
                        Scope &amp; Deliverables
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.deliverables.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-mono uppercase tracking-wider"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                  {hasValidLiveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black px-6 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
                    >
                      View Live Project ↗
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-3.5 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-white/40 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function ClientPortfolio({ initialProjects }: { initialProjects: Project[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <PortfolioContent initialProjects={initialProjects} />
    </Suspense>
  );
}