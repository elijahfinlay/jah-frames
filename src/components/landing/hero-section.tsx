"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Shield, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1200px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-3.5 w-3.5" />
            100% Client-Side — Your videos never leave your device
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Extract Frames from Video.{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Free. Private. Instant.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Convert any video to high-quality frames, GIFs, contact sheets, and more.
            All processing happens in your browser — zero uploads, zero login, zero limits.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button render={<Link href="/video-to-frames" />} size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
              <Layers className="h-4 w-4" />
              Extract Frames Now
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button render={<Link href="#tools" />} variant="outline" size="lg" className="gap-2">
              Explore All Tools
            </Button>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Shield, label: "Private", desc: "Nothing leaves your browser" },
              { icon: Zap, label: "Instant", desc: "FFmpeg WASM processing" },
              { icon: Layers, label: "Powerful", desc: "11 features others don't have" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
