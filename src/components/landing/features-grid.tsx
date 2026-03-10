"use client";

import { motion } from "framer-motion";
import {
  Image,
  FileImage,
  Palette,
  Columns2,
  Zap,
  SlidersHorizontal,
  Type,
  ListTodo,
  Sparkles,
  Globe,
  Timer,
} from "lucide-react";

const features = [
  { icon: Globe, title: "WebP Output", desc: "Modern format with superior compression" },
  { icon: Sparkles, title: "GIF Maker", desc: "Palette-optimized animated GIFs" },
  { icon: Image, title: "Sprite Sheet", desc: "Grid images for game devs & animators" },
  { icon: FileImage, title: "Contact Sheet", desc: "Timestamped grid with video metadata" },
  { icon: SlidersHorizontal, title: "Frame Filters", desc: "Brightness, contrast, saturation, blur" },
  { icon: Columns2, title: "Side-by-Side Compare", desc: "Draggable slider for filter preview" },
  { icon: Zap, title: "Scene Detection", desc: "Auto-detect scene changes, extract key frames" },
  { icon: Timer, title: "Timeline Trimmer", desc: "Visual drag handles for time range" },
  { icon: Type, title: "Frame Annotations", desc: "Add text/watermark overlay" },
  { icon: ListTodo, title: "Batch Processing", desc: "Queue multiple videos for extraction" },
  { icon: Palette, title: "Smart Thumbnails", desc: "Auto-select representative frames" },
];

export function FeaturesGrid() {
  return (
    <section className="border-t border-border/50 bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight">
            11 Features They Don&apos;t Have
          </h2>
          <p className="mt-3 text-muted-foreground">
            We go beyond basic frame extraction with tools you won&apos;t find anywhere else.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.4) }}
              className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
