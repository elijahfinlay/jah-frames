import type { Metadata } from "next";
import { Film, Shield, Globe, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "About JahFrames — privacy policy, terms of use, and how we work.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Film className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">About JahFrames</h1>
        <p className="mt-3 text-muted-foreground">
          A free, browser-based video toolkit built with privacy first.
        </p>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold m-0">What is JahFrames?</h2>
          </div>
          <p className="text-muted-foreground">
            JahFrames is a completely free, browser-based video toolkit that lets you extract
            frames, compress videos, create GIFs, and generate contact sheets — all without
            uploading your files anywhere. Everything is processed locally on your device using
            FFmpeg WebAssembly technology.
          </p>
        </section>

        <section id="privacy">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold m-0">Privacy Policy</h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">We don&apos;t collect your data.</strong> Period.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your video files are never uploaded to any server</li>
              <li>All processing happens entirely in your web browser</li>
              <li>We don&apos;t use cookies for tracking</li>
              <li>We don&apos;t require sign-up or login</li>
              <li>We don&apos;t collect analytics on your video content</li>
              <li>We don&apos;t store any of your files or extracted frames</li>
            </ul>
            <p>
              The only data that leaves your browser is the initial download of the FFmpeg
              WebAssembly module from a CDN, which is a one-time download cached by your browser.
            </p>
          </div>
        </section>

        <section id="terms">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold m-0">Terms of Use</h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>By using JahFrames, you agree to the following:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You have the right to process the video files you upload</li>
              <li>You are responsible for the content you process</li>
              <li>JahFrames is provided &quot;as is&quot; without warranty</li>
              <li>We are not liable for any data loss during processing</li>
              <li>You may use extracted frames according to the original content&apos;s license</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Technology</h2>
          <p className="text-muted-foreground">
            JahFrames is built with Next.js, React, and Tailwind CSS. Video processing
            is powered by FFmpeg compiled to WebAssembly, running entirely in your
            browser. Frame manipulation uses the HTML5 Canvas API.
          </p>
        </section>
      </div>
    </div>
  );
}
