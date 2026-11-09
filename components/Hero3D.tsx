"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import { useRef, useState } from "react";

// This function builds the actual morphing 3D object
function LiquidShape() {
  const meshRef = useRef<any>(null);
  const [hovered, setHover] = useState(false);
  const { viewport } = useThree();

  // Dynamically scale down on narrow portrait phones/foldables so the sphere never clips off-screen,
  // while keeping the exact 1.0 base scale on tablets, laptops, and desktops.
  const responsiveBaseScale = Math.min(1, viewport.width / 3.8);
  const finalScale = hovered ? responsiveBaseScale * 1.4 : responsiveBaseScale;

  // This rotates our 3D object slightly every single frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    // Float gives it a gentle up-and-down breathing animation
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere
        ref={meshRef}
        args={[1.5, 96, 96]}
        scale={finalScale}
        // Only trigger hover expansion on real mouse pointers (prevents getting stuck on mobile taps)
        onPointerOver={(e) => {
          if (e.pointerType === "mouse") setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        {/* This material is the secret to the liquid distortion */}
        <MeshDistortMaterial
          color={hovered ? "#ffffff" : "#555555"}
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          wireframe={true}
        />
      </Sphere>
    </Float>
  );
}

// This wraps our shape in the 3D Canvas environment
export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none sm:pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 4] }}
        // 1. CAP THE PIXEL RATIO: Stops high-res screens from frying the GPU
        dpr={[1, 1.5]}
        // 2. DISABLE UNNECESSARY CALCULATIONS
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={2} />
        <LiquidShape />
      </Canvas>
    </div>
  );
}