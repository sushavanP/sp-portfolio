import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat, Fraunces, JetBrains_Mono } from "next/font/google";
import SketchDefs from "@/components/sketch/SketchDefs";
import { site } from "@/content/site";
import "lenis/dist/lenis.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/sketch.css";
import "@/styles/valley.css";

// Self-hosted at build time by next/font, with font-display: swap (DESIGN.md §11)
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});
// Body and UI font. DESIGN.md originally named Instrument Sans; swapped at the owner's request
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap", preload: false });

const title = `${site.name}: Software Engineer`;

export const metadata: Metadata = {
  title,
  description: site.description,
  ...(site.url && { metadataBase: new URL(site.url) }),
  openGraph: {
    title,
    description: site.description,
    type: "profile",
    siteName: site.name,
    locale: "en_IN",
  },
  twitter: { card: "summary", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
  colorScheme: "light",
};

// Before first paint: flag that motion will run so the hero can start
// hidden. Without JS (or with reduced motion) it never is.
const headScript = `if(matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.dataset.motion="";`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${bricolage.variable} ${mono.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <SketchDefs />
        {children}
      </body>
    </html>
  );
}
