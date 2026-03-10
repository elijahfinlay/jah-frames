"use client";

import { motion } from "framer-motion";
import {
  Video,
  Presentation,
  Palette,
  BookOpen,
  Gamepad2,
  TrendingUp,
} from "lucide-react";

const cases = [
  { icon: Video, title: "Content Creation", desc: "Extract thumbnails and stills from video content for social media posts." },
  { icon: Presentation, title: "Presentations", desc: "Grab key frames for slide decks and documentation." },
  { icon: Palette, title: "Design & Art", desc: "Capture reference frames, create mood boards, and study color palettes." },
  { icon: BookOpen, title: "Education", desc: "Extract diagrams and key moments from lecture recordings." },
  { icon: Gamepad2, title: "Game Development", desc: "Generate sprite sheets and animation frames from video references." },
  { icon: TrendingUp, title: "Analysis", desc: "Extract frames for motion analysis, quality review, and comparison." },
];

export function UseCases() {
  return (
    <section className="border-t border-border/50 bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight">Who Uses JahFrames?</h2>
          <p className="mt-3 text-muted-foreground">Trusted by creators, developers, and professionals</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.08, 0.3) }}
              className="rounded-xl border border-border/50 bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
