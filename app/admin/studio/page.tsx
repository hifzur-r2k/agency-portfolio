"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  saveImageToDatabase,
  getPortfolioImages,
  deletePortfolioImage,
  verifyPasscode,
  getProjects,
  saveProject,
  deleteProject,
  updateProject,
} from "./actions";

const LAYOUT_PRESETS = [
  { name: "Slot 1 (Top Right)", top: "12%", left: "68%", width: "w-[35vw] md:w-[20vw]", speed: 0.15, depth: 30, aspect: "aspect-[4/5]" },
  { name: "Slot 2 (Top Center)", top: "8%", left: "40%", width: "w-[28vw] md:w-[15vw]", speed: 0.1, depth: 20, aspect: "aspect-[4/5]" },
  { name: "Slot 3 (Left Base)", top: "30%", left: "4%", width: "w-[35vw] md:w-[22vw]", speed: -0.05, depth: 10, aspect: "aspect-[4/5]" },
  { name: "Slot 4 (Left Deep)", top: "18%", left: "22%", width: "w-[25vw] md:w-[12vw]", speed: -0.15, depth: -25, aspect: "aspect-[4/5]" },
  { name: "Slot 5 (Bottom Center)", top: "72%", left: "32%", width: "w-[28vw] md:w-[14vw]", speed: 0.05, depth: -10, aspect: "aspect-[4/5]" },
  { name: "Slot 6 (Bottom Left)", top: "62%", left: "12%", width: "w-[22vw] md:w-[10vw]", speed: 0.2, depth: 50, aspect: "aspect-[9/16]" },
  { name: "Slot 7 (Bottom Right)", top: "55%", left: "78%", width: "w-[30vw] md:w-[18vw]", speed: -0.1, depth: -35, aspect: "aspect-[4/5]" },
  { name: "Slot 8 (Bottom Anchor)", top: "78%", left: "55%", width: "w-[28vw] md:w-[16vw]", speed: 0.12, depth: 15, aspect: "aspect-[4/5]" },
];

const CATEGORIES = ["Digital Marketing", "Video Production", "Graphic Design", "Web & App Dev"];

const getPreviewWidth = (widthClass: string) => {
  const match = widthClass.match(/md:w-\[(\d+)vw\]/);
  return match ? `${match[1]}%` : "15%";
};

const getAspectRatioStyle = (aspectClass: string) => {
  if (aspectClass === "aspect-square") return "1 / 1";
  if (aspectClass === "aspect-video") return "16 / 9";
  const match = aspectClass.match(/aspect-\[(.+)\]/);
  return match ? match[1].replace("/", " / ") : "4 / 5";
};

// ==========================================
// RESTORED GROUPED PREVIEW CARD
// ==========================================
function FloatingPreviewCard({ imageGroup, isLive = false, onEdit, onDelete, editingGroupKey }: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const baseImg = imageGroup[0];
  
  useEffect(() => {
    if (!isHovered || imageGroup.length <= 1) {
      setCurrentSlide(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageGroup.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [isHovered, imageGroup.length]);

  return (
    <div
      className={`group absolute border border-white/10 bg-black/50 rounded overflow-hidden transition-all duration-300 z-10 cursor-pointer ${
        isLive
          ? `border-2 z-30 pointer-events-none ${editingGroupKey ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]'}`
          : "opacity-40 hover:opacity-100 hover:z-40 hover:scale-105 grayscale hover:grayscale-0 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      }`}
      style={{ top: baseImg.top_pos, left: baseImg.left_pos, width: getPreviewWidth(baseImg.width_class), aspectRatio: getAspectRatioStyle(baseImg.aspect_ratio) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageGroup.map((img: any, idx: number) => (
        <Image
          key={idx}
          src={img.src}
          fill
          className={`object-cover transition-all duration-700 ${idx === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
          alt="Floating Item"
        />
      ))}

      {imageGroup.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
          {imageGroup.map((_: any, idx: number) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-3 bg-white" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      )}

      {isLive && (
        <div className={`absolute top-0 left-0 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest z-30 ${editingGroupKey ? 'bg-blue-500' : 'bg-green-500 text-black'}`}>
          {editingGroupKey ? "Live Edit" : "Live Setup"}
        </div>
      )}

      {!isLive && onEdit && onDelete && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(imageGroup); }} className="bg-blue-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-600 hover:scale-110 shadow-lg">✎</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(imageGroup); }} className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 hover:scale-110 shadow-lg">✕</button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN DASHBOARD
// ==========================================
export default function StudioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<"floating" | "cases">("floating");

  // TAB 1: FLOATING GALLERY STATES
  const [floatingImages, setFloatingImages] = useState<string[]>([]);
  const [isSavingFloating, setIsSavingFloating] = useState(false);
  const [dbImages, setDbImages] = useState<any[]>([]);
  const [activePreset, setActivePreset] = useState(LAYOUT_PRESETS[0]);
  const [editingGroupKey, setEditingGroupKey] = useState<string | null>(null);
  const [editingIds, setEditingIds] = useState<number[]>([]); // Tracks DB row IDs for deletion on update

  // TAB 2: CASE STUDIES STATES
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [isSavingCase, setIsSavingCase] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState<number | null>(null);
  const [caseImages, setCaseImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [impact, setImpact] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [description, setDescription] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const loadAllData = async () => {
    const [floatingData, projectsData] = await Promise.all([
      getPortfolioImages(),
      getProjects(),
    ]);
    if (floatingData) setDbImages(floatingData);
    if (projectsData) setDbProjects(projectsData);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- FLOATING GALLERY DATA SANITIZER & GROUPER ---
  // Fixes any JSON array data corruption and groups rows by exact coordinates perfectly
  const sanitizedDbImages: any[] = [];
  for (const img of dbImages) {
    try {
      if (typeof img.src === 'string' && img.src.trim().startsWith('[')) {
        const parsed = JSON.parse(img.src);
        parsed.forEach((src: string) => sanitizedDbImages.push({ ...img, src }));
      } else {
        sanitizedDbImages.push(img);
      }
    } catch {
      sanitizedDbImages.push(img);
    }
  }

  const groupedDbImages = Object.values(
    sanitizedDbImages.reduce((acc: any, img: any) => {
      const key = `${img.top_pos}_${img.left_pos}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(img);
      return acc;
    }, {})
  ) as any[][];

  // --- FLOATING GALLERY HANDLERS ---
  const handleEditFloating = (group: any[]) => {
    const baseImg = group[0];
    const groupKey = `${baseImg.top_pos}_${baseImg.left_pos}`;
    setEditingGroupKey(groupKey);
    
    // Track all database row IDs involved in this slot so we can delete them if updated
    setEditingIds(group.map(img => img.id).filter(id => id)); 
    setFloatingImages(group.map(img => img.src));
    
    setActivePreset({
      name: "Custom (Editing)", top: baseImg.top_pos, left: baseImg.left_pos, width: baseImg.width_class,
      aspect: baseImg.aspect_ratio || "aspect-[4/5]", speed: Number(baseImg.speed), depth: Number(baseImg.depth),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelFloating = () => {
    setFloatingImages([]); setEditingIds([]); setEditingGroupKey(null); setActivePreset(LAYOUT_PRESETS[0]);
  };

  const handleDeleteFloating = async (group: any[]) => {
    if (window.confirm("Are you sure you want to remove this entire stack from your live portfolio?")) {
      for (const img of group) {
        if (img.id) await deletePortfolioImage(img.id);
      }
      loadAllData();
    }
  };

  // --- CASE STUDY HANDLERS ---
  const handleEditCase = (project: any) => {
    setEditingCaseId(project.id); setTitle(project.title); setCategory(project.category);
    setImpact(project.impact || ""); setDeliverables(project.deliverables ? project.deliverables.join(", ") : "");
    setDescription(project.description || ""); setLiveUrl(project.liveUrl || ""); setCaseImages(project.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelCaseEdit = () => {
    setEditingCaseId(null);
    setTitle(""); setImpact(""); setDeliverables(""); setDescription(""); setLiveUrl(""); setCaseImages([]);
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this case study?")) {
      await deleteProject(id);
      loadAllData();
      if (editingCaseId === id) handleCancelCaseEdit();
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8">
        <form
          className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center gap-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-700"
          action={async () => {
            const isValid = await verifyPasscode(passcode);
            if (isValid) setIsAuthenticated(true);
            else { setAuthError(true); setPasscode(""); }
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase tracking-widest">Restricted Area</h1>
            <p className="text-gray-400 font-mono text-xs mt-2 uppercase tracking-widest">Enter Master Passcode</p>
          </div>
          <div className="w-full flex flex-col gap-2 mt-4">
            <input type="password" value={passcode} onChange={(e) => { setPasscode(e.target.value); setAuthError(false); }} className={`w-full bg-black/50 border ${authError ? "border-red-500" : "border-white/20"} rounded p-4 text-center font-mono tracking-[0.5em] focus:border-white outline-none transition-colors`} placeholder="••••••••" required />
            {authError && <span className="text-red-500 text-[10px] font-mono uppercase text-center">Access Denied. Incorrect Passcode.</span>}
          </div>
          <button type="submit" className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded hover:bg-gray-200 transition-colors mt-2 cursor-pointer">Unlock Vault</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Agency Studio</h1>
            <p className="text-gray-400 font-mono text-xs mt-2 uppercase tracking-widest">Unified Portfolio Command Center</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/5 border border-white/10 p-1.5 rounded-xl flex gap-2">
              <button type="button" onClick={() => setActiveTab("floating")} className={`px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all cursor-pointer ${activeTab === "floating" ? "bg-white text-black font-bold shadow" : "text-gray-400 hover:text-white"}`}>
                1. Homepage Radar ({groupedDbImages.length})
              </button>
              <button type="button" onClick={() => setActiveTab("cases")} className={`px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all cursor-pointer ${activeTab === "cases" ? "bg-white text-black font-bold shadow" : "text-gray-400 hover:text-white"}`}>
                2. Case Studies ({dbProjects.length})
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: FLOATING GALLERY (WITH FLAWLESS EDITING RESTORED)  */}
        {/* ========================================================= */}
        {activeTab === "floating" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col gap-6">
              {floatingImages.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-6 h-full min-h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <h3 className="text-xl font-medium">Add New Homepage Floating Piece</h3>
                  <CldUploadWidget uploadPreset="agency_portfolio" options={{ multiple: true, maxFiles: 6 }} onSuccess={(result: any) => setFloatingImages(prev => [...prev, result.info.secure_url])}>
                    {({ open }) => (
                      <button type="button" onClick={() => open()} className="mt-4 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-transform cursor-pointer">Select Image</button>
                    )}
                  </CldUploadWidget>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-6 z-50 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold uppercase tracking-widest">{editingGroupKey ? "Edit Layout" : "Position Settings"}</h3>
                    <button type="button" onClick={handleCancelFloating} className="text-xs text-red-400 font-mono uppercase tracking-widest cursor-pointer">Cancel</button>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-2 border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400 font-mono uppercase">Slides ({floatingImages.length})</label>
                      <CldUploadWidget uploadPreset="agency_portfolio" options={{ multiple: true, maxFiles: 6 }} onSuccess={(result: any) => setFloatingImages(prev => [...prev, result.info.secure_url])}>
                        {({ open }) => <button type="button" onClick={() => open()} className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded font-mono uppercase tracking-widest cursor-pointer">+ Add More</button>}
                      </CldUploadWidget>
                    </div>
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {floatingImages.map((img, i) => (
                        <div key={i} className="relative w-12 h-12 flex-shrink-0 rounded border border-white/20 group">
                          <Image src={img} fill className="object-cover" alt="Slide" />
                          <button type="button" onClick={() => setFloatingImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-mono uppercase mb-3 block">Smart Layout Slots</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {LAYOUT_PRESETS.map((preset, index) => (
                        <button key={index} type="button" onClick={() => setActivePreset(preset)} className={`py-2 px-1 text-xs font-mono border rounded transition-colors cursor-pointer ${activePreset.name === preset.name ? "bg-blue-500 border-blue-500 text-white" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>Slot {index + 1}</button>
                      ))}
                    </div>
                  </div>
                  <form className="flex flex-col gap-6 mt-4" action={async () => {
                    if (floatingImages.length === 0) return alert("Upload at least one image.");
                    setIsSavingFloating(true);
                    
                    // 1. Wipe the old rows first if editing an existing stack
                    if (editingIds.length > 0) {
                      for (const id of editingIds) await deletePortfolioImage(id);
                    }
                    
                    // 2. Insert new individual rows perfectly aligned with FloatingGallery.tsx architecture
                    for (const src of floatingImages) {
                      const fd = new FormData();
                      fd.append("src", src);
                      fd.append("top_pos", activePreset.top);
                      fd.append("left_pos", activePreset.left);
                      fd.append("width_class", activePreset.width);
                      fd.append("aspect_ratio", activePreset.aspect);
                      fd.append("speed", activePreset.speed.toString());
                      fd.append("depth", activePreset.depth.toString());
                      await saveImageToDatabase(fd);
                    }
                    
                    loadAllData();
                    handleCancelFloating();
                    setIsSavingFloating(false);
                  }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Top</label><input name="top_pos" type="text" value={activePreset.top} onChange={(e) => setActivePreset({ ...activePreset, top: e.target.value })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                      <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Left</label><input name="left_pos" type="text" value={activePreset.left} onChange={(e) => setActivePreset({ ...activePreset, left: e.target.value })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                      <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Width</label><input name="width_class" type="text" value={activePreset.width} onChange={(e) => setActivePreset({ ...activePreset, width: e.target.value })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 font-mono uppercase">Aspect</label>
                        <select name="aspect_ratio" value={activePreset.aspect} onChange={(e) => setActivePreset({ ...activePreset, aspect: e.target.value })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none cursor-pointer">
                          <option value="aspect-[4/5]">Portrait (4:5)</option><option value="aspect-[9/16]">Story (9:16)</option><option value="aspect-square">Square (1:1)</option><option value="aspect-[3/2]">Classic Photo (3:2)</option><option value="aspect-video">Landscape (16:9)</option><option value="aspect-[21/9]">Cinematic (21:9)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Speed</label><input name="speed" type="number" step="0.01" value={activePreset.speed} onChange={(e) => setActivePreset({ ...activePreset, speed: parseFloat(e.target.value) })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                      <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Depth</label><input name="depth" type="number" value={activePreset.depth} onChange={(e) => setActivePreset({ ...activePreset, depth: parseInt(e.target.value) })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                    </div>
                    <button type="submit" disabled={isSavingFloating} className={`mt-2 w-full py-4 text-black font-bold uppercase tracking-widest text-sm rounded transition-colors disabled:opacity-50 cursor-pointer ${editingGroupKey ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-white hover:bg-gray-200'}`}>
                      {isSavingFloating ? "Saving..." : editingGroupKey ? "Update Layout Stack" : "Lock Stack into Layout"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="w-full bg-[#0a0a0a] rounded-2xl border border-white/10 relative overflow-hidden aspect-[4/3] md:aspect-video flex items-center justify-center pointer-events-auto min-h-[400px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">Proven</h2>
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-blue-500 leading-none">Impact</h2>
              </div>

              {groupedDbImages.filter(group => {
                const key = `${group[0].top_pos}_${group[0].left_pos}`;
                return key !== editingGroupKey;
              }).map((group, idx) => (
                <FloatingPreviewCard 
                  key={idx} 
                  imageGroup={group} 
                  onEdit={handleEditFloating} 
                  onDelete={handleDeleteFloating} 
                />
              ))}

              {floatingImages.length > 0 && (
                <FloatingPreviewCard 
                  imageGroup={floatingImages.map(src => ({
                    src, top_pos: activePreset.top, left_pos: activePreset.left, width_class: activePreset.width, aspect_ratio: activePreset.aspect
                  }))} 
                  isLive={true} 
                  editingGroupKey={editingGroupKey} 
                />
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CASE STUDIES                                       */}
        {/* ========================================================= */}
        {activeTab === "cases" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold uppercase tracking-widest">
                  {editingCaseId ? "Edit Case Study" : "Publish New Case Study"}
                </h3>
                {editingCaseId && (
                  <button type="button" onClick={handleCancelCaseEdit} className="text-xs text-red-400 font-mono uppercase tracking-widest cursor-pointer hover:text-red-300 transition-colors">Cancel Edit</button>
                )}
              </div>
              <form
                className="flex flex-col gap-5"
                action={async (formData) => {
                  if (caseImages.length === 0) return alert("Upload at least 1 image.");
                  setIsSavingCase(true);
                  formData.append("images", JSON.stringify(caseImages));
                  
                  if (editingCaseId) {
                    await updateProject(editingCaseId, formData);
                  } else {
                    await saveProject(formData);
                  }
                  
                  handleCancelCaseEdit();
                  loadAllData();
                  setIsSavingCase(false);
                  alert(editingCaseId ? "Case Study Updated!" : "Case Study Published!");
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1"><label className="text-xs text-gray-400 font-mono uppercase">Title *</label><input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" /></div>
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1"><label className="text-xs text-gray-400 font-mono uppercase">Category *</label><select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1"><label className="text-xs text-gray-400 font-mono uppercase">Impact Badge</label><input name="impact" value={impact} onChange={(e) => setImpact(e.target.value)} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" /></div>
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1"><label className="text-xs text-gray-400 font-mono uppercase">Deliverables</label><input name="deliverables" value={deliverables} onChange={(e) => setDeliverables(e.target.value)} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" /></div>
                </div>
                <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Full Description *</label><textarea name="description" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" /></div>
                <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Live URL</label><input name="liveUrl" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" /></div>

                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400 font-mono uppercase">Slides ({caseImages.length})</label>
                    <CldUploadWidget uploadPreset="agency_portfolio" options={{ multiple: true, maxFiles: 10 }} onSuccess={(result: any) => setCaseImages((prev) => [...prev, result.info.secure_url])}>
                      {({ open }) => <button type="button" onClick={() => open()} className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded font-mono uppercase tracking-widest cursor-pointer transition-colors">+ Upload</button>}
                    </CldUploadWidget>
                  </div>
                  {caseImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {caseImages.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 flex-shrink-0 rounded border border-white/20 group">
                          <Image src={img} fill className="object-cover" alt="Slide" />
                          <button type="button" onClick={() => setCaseImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button type="submit" disabled={isSavingCase} className={`mt-2 w-full py-4 text-black font-bold uppercase tracking-widest text-sm rounded cursor-pointer transition-colors ${editingCaseId ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-white hover:bg-gray-200"}`}>
                  {isSavingCase ? "Saving..." : editingCaseId ? "Update Case Study" : "Publish Case Study"}
                </button>
              </form>
            </div>

            <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-8 flex flex-col max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold uppercase tracking-widest mb-6">Published ({dbProjects.length})</h3>
              <div className="flex flex-col gap-4">
                {dbProjects.map((project) => (
                  <div key={project.id} className={`flex items-center gap-4 border p-3 rounded-xl transition-colors ${editingCaseId === project.id ? "bg-blue-500/10 border-blue-500/30" : "bg-white/5 border-white/10"}`}>
                    <div className="relative w-16 h-12 flex-shrink-0 rounded bg-black">
                      {project.images?.[0] && <Image src={project.images[0]} fill className="object-cover" alt={project.title} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate uppercase">{project.title}</h4>
                      <p className="text-[10px] text-gray-500 font-mono uppercase truncate">{project.category} • {project.images?.length || 0} Slides</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEditCase(project)} className="w-8 h-8 rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center cursor-pointer transition-colors" title="Edit Case Study">✎</button>
                      <button type="button" onClick={() => handleDeleteProject(project.id)} className="w-8 h-8 rounded border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center cursor-pointer transition-colors" title="Delete Case Study">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}