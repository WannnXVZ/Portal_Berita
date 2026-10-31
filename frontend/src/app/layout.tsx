import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, DM_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SWRProvider } from "@/components/providers/swr-provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Tanah Merah News! — Portal Berita Digital Modern",
    template: "%s | Tanah Merah News!",
  },
  description:
    "Portal berita digital modern, cepat, dan terpercaya. Berita terkini Kalimantan Timur, IKN Nusantara, dan Indonesia.",
  keywords: [
    "berita kaltim",
    "berita samarinda",
    "berita balikpapan",
    "IKN Nusantara",
    "Tanah Merah News",
    "berita terkini",
    "portal berita",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Tanah Merah News!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans">
        <SWRProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SWRProvider>
        <Toaster />
      </body>
    </html>
  );
}
