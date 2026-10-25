"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState, useEffect } from "react";
import Image from "next/image";
import { saveImageToDatabase, getPortfolioImages, deletePortfolioImage, verifyPasscode } from "./actions";

const LAYOUT_PRESETS = [
    { name: "Slot 1 (Top Right)", top: "12%", left: "68%", width: "w-[35vw] md:w-[20vw]", speed: 0.15, depth: 30, aspect: "aspect-[4/5]" },
    { name: "Slot 2 (Top Center)", top: "8%", left: "40%", width: "w-[28vw] md:w-[15vw]", speed: 0.1, depth: 20, aspect: "aspect-[4/5]" },
    { name: "Slot 3 (Left Base)", top: "30%", left: "4%", width: "w-[35vw] md:w-[22vw]", speed: -0.05, depth: 10, aspect: "aspect-[4/5]" },
    { name: "Slot 4 (Left Deep)", top: "18%", left: "22%", width: "w-[25vw] md:w-[12vw]", speed: -0.15, depth: -25, aspect: "aspect-[4/5]" },
    { name: "Slot 5 (Bottom Center)", top: "72%", left: "32%", width: "w-[28vw] md:w-[14vw]", speed: 0.05, depth: -10, aspect: "aspect-[4/5]" },
    { name: "Slot 6 (Bottom Left)", top: "62%", left: "12%", width: "w-[22vw] md:w-[10vw]", speed: 0.2, depth: 50, aspect: "aspect-[9/16]" },
    { name: "Slot 7 (Bottom Right)", top: "55%", left: "78%", width: "w-[30vw] md:w-[18vw]", speed: -0.1, depth: -35, aspect: "aspect-[4/5]" },
    { name: "Slot 8 (Bottom Anchor)", top: "78%", left: "55%", width: "w-[28vw] md:w-[16vw]", speed: 0.12, depth: 15, aspect: "aspect-[4/5]" }
];

const getPreviewWidth = (widthClass: string) => {
    const match = widthClass.match(/md:w-\[(\d+)vw\]/);
    return match ? `${match[1]}%` : '15%';
};

export default function AdminStudio() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [authError, setAuthError] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [dbImages, setDbImages] = useState<any[]>([]);
    const [activePreset, setActivePreset] = useState(LAYOUT_PRESETS[0]);

    useEffect(() => {
        getPortfolioImages().then((data) => {
            if (data) setDbImages(data);
        });
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to remove this image from your live portfolio?")) {
            await deletePortfolioImage(id);
            setDbImages(dbImages.filter(img => img.id !== id));
        }
    };
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8">
                <form
                    className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center gap-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-700"
                    action={async () => {
                        const isValid = await verifyPasscode(passcode);
                        if (isValid) {
                            setIsAuthenticated(true);
                        } else {
                            setAuthError(true);
                            setPasscode("");
                        }
                    }}
                >
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-black uppercase tracking-widest">Restricted Area</h1>
                        <p className="text-gray-400 font-mono text-xs mt-2 uppercase tracking-widest">Enter Master Passcode</p>
                    </div>

                    <div className="w-full flex flex-col gap-2 mt-4">
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => {
                                setPasscode(e.target.value);
                                setAuthError(false);
                            }}
                            className={`w-full bg-black/50 border ${authError ? 'border-red-500' : 'border-white/20'} rounded p-4 text-center font-mono tracking-[0.5em] focus:border-white outline-none transition-colors`}
                            placeholder="••••••••"
                            required
                        />
                        {authError && <span className="text-red-500 text-[10px] font-mono uppercase text-center">Access Denied. Incorrect Passcode.</span>}
                    </div>

                    <button type="submit" className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded hover:bg-gray-200 transition-colors mt-2">
                        Unlock Vault
                    </button>
                </form>
            </main>
        );
    }
    return (
        <main className="min-h-screen bg-[#050505] text-white p-8 md:p-12 flex flex-col items-center">
            <div className="w-full max-w-7xl flex flex-col gap-10">

                {/* Header */}
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Agency Studio</h1>
                    <p className="text-gray-400 font-mono text-sm mt-2 uppercase tracking-widest">
                        Portfolio Image Management
                    </p>
                </div>

                {/* PERMANENT SPLIT-SCREEN LAYOUT */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">

                    {/* LEFT COLUMN: Upload Widget OR Form Controls */}
                    <div className="flex flex-col gap-6">
                        {!uploadedImage ? (
                            // Default State: The Upload Dropzone
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-6 h-full min-h-[400px]">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium">Add New Portfolio Piece</h3>
                                <CldUploadWidget
                                    uploadPreset="agency_portfolio"
                                    onSuccess={(result: any) => setUploadedImage(result.info.secure_url)}
                                >
                                    {({ open }) => (
                                        <button onClick={() => open()} className="mt-4 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-transform">
                                            Select Image
                                        </button>
                                    )}
                                </CldUploadWidget>
                            </div>
                        ) : (
                            // Active Upload State: The Coordinate Form
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-6 z-50 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold uppercase tracking-widest">Position Settings</h3>
                                    <button onClick={() => setUploadedImage(null)} className="text-xs text-red-400 font-mono uppercase tracking-widest hover:text-red-300">
                                        Cancel Upload
                                    </button>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 font-mono uppercase mb-3 block">Smart Layout Slots</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {LAYOUT_PRESETS.map((preset, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setActivePreset(preset)}
                                                className={`py-2 px-1 text-xs font-mono border rounded transition-colors ${activePreset.name === preset.name
                                                    ? 'bg-blue-500 border-blue-500 text-white'
                                                    : 'border-white/10 text-gray-400 hover:bg-white/5'
                                                    }`}
                                            >
                                                Slot {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <form
                                    className="flex flex-col gap-6 mt-4"
                                    action={async (formData) => {
                                        setIsSaving(true);
                                        await saveImageToDatabase(formData);
                                        alert("Image securely locked into the database!");

                                        setDbImages([...dbImages, {
                                            id: Date.now(), src: uploadedImage, top_pos: activePreset.top, left_pos: activePreset.left,
                                            width_class: activePreset.width, aspect_ratio: activePreset.aspect
                                        }]);

                                        setUploadedImage(null);
                                        setIsSaving(false);
                                    }}
                                >
                                    <input type="hidden" name="src" value={uploadedImage} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Top Position</label><input name="top_pos" type="text" value={activePreset.top} onChange={(e) => setActivePreset({ ...activePreset, top: e.target.value })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                                        <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Left Position</label><input name="left_pos" type="text" value={activePreset.left} onChange={(e) => setActivePreset({ ...activePreset, left: e.target.value })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                                        <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Width Class</label><input name="width_class" type="text" value={activePreset.width} onChange={(e) => setActivePreset({ ...activePreset, width: e.target.value })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                                        <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Aspect Ratio</label><input name="aspect_ratio" type="text" value={activePreset.aspect} onChange={(e) => setActivePreset({ ...activePreset, aspect: e.target.value })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                                        <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">Scroll Speed</label><input name="speed" type="number" step="0.01" value={activePreset.speed} onChange={(e) => setActivePreset({ ...activePreset, speed: parseFloat(e.target.value) })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                                        <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 font-mono uppercase">3D Depth</label><input name="depth" type="number" value={activePreset.depth} onChange={(e) => setActivePreset({ ...activePreset, depth: parseInt(e.target.value) })} className="bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-white outline-none" required /></div>
                                    </div>
                                    <button type="submit" disabled={isSaving} className="mt-2 w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded hover:bg-gray-200 transition-colors disabled:opacity-50">
                                        {isSaving ? "Saving to Database..." : "Lock Image into Layout"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: The Permanent Live Radar Map */}
                    <div className="w-full bg-[#0a0a0a] rounded-2xl border border-white/10 relative overflow-hidden aspect-[4/3] md:aspect-video flex items-center justify-center pointer-events-auto min-h-[400px]">

                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
                            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">Proven</h2>
                            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-blue-500 leading-none">Impact</h2>
                        </div>

                        {/* Live Database Images */}
                        {dbImages.map((img) => (
                            <div
                                key={img.id}
                                className="group absolute border border-white/10 bg-black/50 rounded overflow-hidden opacity-40 hover:opacity-100 hover:z-40 hover:scale-105 grayscale hover:grayscale-0 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)] transition-all duration-300 z-10 cursor-pointer"
                                style={{
                                    top: img.top_pos,
                                    left: img.left_pos,
                                    width: getPreviewWidth(img.width_class),
                                    aspectRatio: img.aspect_ratio === 'aspect-[9/16]' ? '9/16' : '4/5',
                                }}
                            >
                                <Image src={img.src} fill className="object-cover" alt="Saved Layout Item" />
                                <button
                                    type="button"
                                    onClick={() => handleDelete(img.id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:scale-110 shadow-lg"
                                    title="Delete Image"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}

                        {/* New Image Preview (Only visible when actively uploading) */}
                        {uploadedImage && (
                            <div
                                className="absolute border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] rounded overflow-hidden z-30 transition-all duration-700 ease-out pointer-events-none"
                                style={{
                                    top: activePreset.top, left: activePreset.left, width: getPreviewWidth(activePreset.width),
                                    aspectRatio: activePreset.aspect === 'aspect-[9/16]' ? '9/16' : '4/5',
                                }}
                            >
                                <Image src={uploadedImage} fill className="object-cover" alt="New Layout Item" />
                                <div className="absolute top-0 left-0 bg-green-500 text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                                    Live
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </main>
    );
}