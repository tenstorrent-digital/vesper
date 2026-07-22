import { IBM_Plex_Sans, Inter_Tight } from "next/font/google";

export const inter_tight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  variable: "--font-inter-tight",
});

export const ibm_plex_sans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  variable: "--font-plex-sans",
});
