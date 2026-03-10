import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JahFrames — Free Video to Frames Extractor",
    template: "%s | JahFrames",
  },
  description:
    "Extract frames from video for free. 100% browser-based — no uploads, no login, no limits. Supports MP4, MOV, AVI, WebM, MKV. Export as PNG, JPG, or WebP.",
  keywords: [
    "video to frames",
    "extract frames from video",
    "video frame extractor",
    "video to image",
    "video to png",
    "gif maker",
    "video compressor",
    "contact sheet",
    "free video tool",
  ],
  openGraph: {
    title: "JahFrames — Free Video to Frames Extractor",
    description:
      "Extract frames from video for free. 100% browser-based, no uploads required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
