"use client";

import { motion } from "framer-motion";
import { Upload, Settings, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "1",
    title: "Drop Your Video",
    desc: "Drag and drop or click to upload. Supports MP4, MOV, AVI, WebM, and MKV files up to 2GB.",
  },
  {
    icon: Settings,
    step: "2",
    title: "Choose Settings",
    desc: "Select extraction mode (FPS, count, scene detect, or manual). Pick format, quality, and time range.",
  },
  {
    icon: Download,
    step: "3",
    title: "Download Frames",
    desc: "Preview your frames, apply filters, then download individually or as a ZIP. All processed locally.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
        <p className="mt-3 text-muted-foreground">Three simple steps to extract frames</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <s.icon className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -top-2 left-1/2 ml-8 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {s.step}
            </div>
            <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
