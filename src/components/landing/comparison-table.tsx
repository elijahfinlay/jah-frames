"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { feature: "Frame extraction (FPS/Count)", us: true, them: true },
  { feature: "Manual capture", us: true, them: true },
  { feature: "PNG & JPG output", us: true, them: true },
  { feature: "Video compressor", us: true, them: true },
  { feature: "Dark/light mode", us: true, them: true },
  { feature: "WebP output", us: true, them: false },
  { feature: "GIF maker", us: true, them: false },
  { feature: "Sprite sheet", us: true, them: false },
  { feature: "Contact sheet", us: true, them: false },
  { feature: "Frame filters", us: true, them: false },
  { feature: "Side-by-side comparison", us: true, them: false },
  { feature: "Scene detection", us: true, them: false },
  { feature: "Visual timeline trimmer", us: true, them: false },
  { feature: "Frame annotations", us: true, them: false },
  { feature: "Batch processing", us: true, them: false },
  { feature: "Smart thumbnails", us: true, them: false },
  { feature: "100% free, no limits", us: true, them: true },
];

export function ComparisonTable() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight">How We Compare</h2>
        <p className="mt-3 text-muted-foreground">JahFrames vs. the competition</p>
      </motion.div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Feature</th>
              <th className="px-4 py-3 text-center font-semibold text-primary">JahFrames</th>
              <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Others</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-2.5 text-xs sm:text-sm">{f.feature}</td>
                <td className="px-4 py-2.5 text-center">
                  {f.us ? (
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  ) : (
                    <X className="mx-auto h-4 w-4 text-muted-foreground" />
                  )}
                </td>
                <td className="px-4 py-2.5 text-center">
                  {f.them ? (
                    <Check className="mx-auto h-4 w-4 text-green-500" />
                  ) : (
                    <X className="mx-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
