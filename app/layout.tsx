import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor"; // 1. Added this

export const metadata: Metadata = {
  title: "Agency Experience Center",
  description: "Digital Marketing, Video Production & Dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#050505] text-white">
        <SmoothScroll>
          <CustomCursor /> {/* 2. Added this */}
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}