import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation"; 
import ContactModal from "@/components/ContactModal"; // 1. Imported the Modal here!

const inter = Inter({ subsets: ["latin"] });

// Production-grade SEO and Social Sharing Metadata
export const metadata: Metadata = {
  title: "AGENCY© | Digital Experience Center",
  description: "Award-winning digital agency specializing in immersive web design, 3D development, and premium brand identities.",
  openGraph: {
    title: "AGENCY© | Digital Experience Center",
    description: "Award-winning digital agency specializing in immersive web design, 3D development, and premium brand identities.",
    url: "https://your-agency-domain.com", 
    siteName: "Agency©",
    images: [
      {
        // This image shows up when you paste the link in WhatsApp/LinkedIn/iMessage
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop", 
        width: 1200,
        height: 630,
        alt: "Agency© Digital Experience Center",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGENCY© | Digital Experience Center",
    description: "Award-winning digital agency specializing in immersive web design, 3D development, and premium brand identities.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#050505] text-[#FAFAFA] antialiased selection:bg-white selection:text-black`}>
        
        {/* 2. Placed the Modal OUTSIDE SmoothScroll so it stays perfectly fixed on the screen */}
        <ContactModal />
        
        <SmoothScroll>
          <CustomCursor />
          <Navigation /> 
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}