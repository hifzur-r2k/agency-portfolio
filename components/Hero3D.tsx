"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import { useRef, useState } from "react";

// This function builds the actual morphing 3D object
function LiquidShape() {
  const meshRef = useRef<any>(null);
  const [hovered, setHover] = useState(false);

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
        // When the user hovers it, it scales up beautifully!
        scale={hovered ? 1.4 : 1}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {/* This material is the secret to the liquid distortion */}
        <MeshDistortMaterial
          color={hovered ? "#ffffff" : "#555555"}
          attach="material"
          distort={0.5} // How chaotic the liquid is
          speed={2} // How fast it boils/morphs
          roughness={0.2}
          wireframe={true} // Makes it look like a futuristic tech grid!
        />
      </Sphere>
    </Float>
  );
}

// This wraps our shape in the 3D Canvas environment
export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 opacity-40">
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