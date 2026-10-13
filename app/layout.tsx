import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agency Experience Center",
  description: "Next-gen digital agency showcasing immersive experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#050505] text-[#FAFAFA] antialiased selection:bg-white selection:text-black`}>
        {/* We changed SmoothScroll to wrap around our page content! */}
        <SmoothScroll>
          <CustomCursor />
          <Navigation /> 
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}