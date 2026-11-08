import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import { PostHogProvider } from "@/components/PostHogProvider";

const inter = Inter({ subsets: ["latin"] });

// Ensures proper scaling from 280px Galaxy Fold to 4K screens + dark mobile browser bar
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

// Production-grade SEO and Social Sharing Metadata (Ready for tomorrow's brand name update)
export const metadata: Metadata = {
  title: "AGENCY© | Digital Experience Center",
  description:
    "Award-winning digital agency specializing in immersive web design, 3D development, and premium brand identities.",
  openGraph: {
    title: "AGENCY© | Digital Experience Center",
    description:
      "Award-winning digital agency specializing in immersive web design, 3D development, and premium brand identities.",
    url: "https://your-agency-domain.com",
    siteName: "Agency©",
    images: [
      {
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
    description:
      "Award-winning digital agency specializing in immersive web design, 3D development, and premium brand identities.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="bg-[#050505]">
      <body
        className={`${inter.className} bg-[#050505] text-[#FAFAFA] antialiased selection:bg-white selection:text-black overflow-x-hidden w-full`}
      >
        <PostHogProvider>
          <SmoothScroll>
            {/* Only render CustomCursor on devices with a real mouse/trackpad */}
            <div className="hidden [@media(pointer:fine)]:block">
              <CustomCursor />
            </div>
            <Navigation />
            {children}
          </SmoothScroll>
        </PostHogProvider>
      </body>
    </html>
  );
}