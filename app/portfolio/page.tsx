"use client";

import { useState, useEffect, Suspense } from "react";
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

const projects: Project[] = [
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
  {
    id: 3,
    title: "Morzi Brand Identity",
    category: "Graphic Design",
    impact: "↗ Complete Brand System",
    deliverables: ["Logo & Visual Identity", "Packaging Design", "Print & Merch Kit"],
    images: [
      "https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Full-scale brand architecture and tactile packaging system designed to stand out on crowded retail shelves and build instant customer recall.",
    liveUrl: "#",
  },
  {
    id: 4,
    title: "Neon Nights",
    category: "Video Production",
    impact: "↗ 1.8M+ Organic Views",
    deliverables: ["RED Cinema Shoot", "Color Grading", "Sound Design & VFX"],
    images: [
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "A cinematic commercial shoot for an upcoming streetwear brand. Shot on RED cameras, this fast-paced editorial video captures the gritty, vibrant energy of the city nightlife.",
    liveUrl: "#",
  },
  {
    id: 5,
    title: "Neo Banking App",
    category: "Web & App Dev",
    impact: "↗ 4.9★ App Store Rating",
    deliverables: ["iOS & Android UI/UX", "Real-Time Telemetry", "Biometric Security"],
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "A fully custom iOS and Android application built for a modern fintech startup. Features include biometric login, real-time crypto tracking, and instant peer-to-peer transfers.",
    liveUrl: "#",
  },
];

// INDIVIDUAL PROJECT CARD WITH HOVER SLIDESHOW
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
    if (!isHovered || project.images.length <= 1) {
      setCurrentSlide(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % project.images.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [isHovered, project.images.length]);

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
      {/* IMAGE BOX */}
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-[#0a0a0a] border border-white/10 group-hover:border-white/30 transition-colors">
        {project.images.map((imgUrl, idx) => (
          <img
            key={idx}
            src={imgUrl}
            alt={`${project.title} - slide ${idx + 1}`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              idx === currentSlide
                ? "opacity-85 group-hover:opacity-100 group-hover:scale-105 z-10"
                : "opacity-0 scale-100 z-0"
            }`}
          />
        ))}

        {/* Subtle Dark Gradient Overlay for Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity z-20 pointer-events-none" />

        {/* TOP LEFT: Impact Proof Badge */}
        <div className="absolute top-4 left-4 z-30 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-widest text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {project.impact}
        </div>

        {/* TOP RIGHT: View Case Prompt */}
        <div className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-widest opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          Explore Case ↗
        </div>

        {/* BOTTOM BAR: Slide Counter & Progress Dots */}
        {project.images.length > 1 && (
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

      {/* TITLE & CATEGORY BAR */}
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

function PortfolioContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Sync with URL query (?category=...) if linked from Homepage
  useEffect(() => {
    const param = searchParams.get("category");
    if (param && CATEGORIES.includes(param as Category)) {
      setActiveCategory(param as Category);
    }
  }, [searchParams]);

  // Lock background scroll & allow ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const getCategoryCount = (cat: Category) =>
    cat === "All"
      ? projects.length
      : projects.filter((p) => p.category === cat).length;

  return (
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA] pt-32 pb-24 px-6 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-gray-500 hover:text-white transition-colors mb-10 inline-block uppercase tracking-widest text-xs font-bold"
        >
          ← Back to Home
        </Link>

        {/* HEADER + INTERACTIVE FILTER TABS */}
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

          {/* FILTER BAR */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                    isActive
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {category}{" "}
                  <span className={`ml-1 text-[9px] ${isActive ? "text-black/60" : "text-gray-600"}`}>
                    ({getCategoryCount(category)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* THE 2-COLUMN PROJECT GRID */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onSelect={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* BOTTOM CONVERSION HOOK */}
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

      {/* DEEP-DIVE MULTI-IMAGE CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/15 w-full max-w-6xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
            >
              {/* LEFT SIDE: Vertical Scrollable Multi-Image Showcase */}
              <div className="w-full md:w-3/5 overflow-y-auto max-h-[50vh] md:max-h-[90vh] p-4 md:p-6 space-y-4 bg-[#050505] border-b md:border-b-0 md:border-r border-white/10">
                {selectedProject.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]"
                  >
                    <img
                      src={imgUrl}
                      alt={`${selectedProject.title} visual ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-gray-300 border border-white/10">
                      0{idx + 1} / 0{selectedProject.images.length}
                    </span>
                  </div>
                ))}
              </div>

              {/* RIGHT SIDE: Sticky Story, Deliverables & CTA */}
              <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-between relative overflow-y-auto max-h-[40vh] md:max-h-[90vh]">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>

                <div>
                  <div className="flex items-center gap-3 mb-4">
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

                  {/* DELIVERABLES TAGS */}
                  <div className="mb-8">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-3">
                      Scope & Deliverables
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
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                  {selectedProject.liveUrl && (
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
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-3.5 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-white/40 font-bold uppercase tracking-widest text-xs transition-colors"
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

export default function Portfolio() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <PortfolioContent />
    </Suspense>
  );
}