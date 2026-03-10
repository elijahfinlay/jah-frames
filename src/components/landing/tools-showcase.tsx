"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Minimize2, Film, Grid3X3, ArrowRight } from "lucide-react";

const tools = [
  {
    icon: Layers,
    title: "Video to Frames",
    description: "Extract frames by FPS, count, scene detection, or manual capture. PNG, JPG, WebP output.",
    href: "/video-to-frames",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Minimize2,
    title: "Video Compressor",
    description: "Reduce video file size with quality or target-size modes. H.264 encoding.",
    href: "/video-compressor",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Film,
    title: "GIF Maker",
    description: "Create high-quality animated GIFs from any video segment. Palette-optimized.",
    href: "/gif-maker",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Grid3X3,
    title: "Contact Sheet",
    description: "Generate a grid overview of your video with timestamps and metadata header.",
    href: "/contact-sheet",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export function ToolsShowcase() {
  return (
    <section id="tools" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight">All-in-One Video Toolkit</h2>
        <p className="mt-3 text-muted-foreground">
          Everything you need to work with video frames — completely free.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="group relative h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="flex h-full flex-col p-6">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tool.bg}`}>
                  <tool.icon className={`h-6 w-6 ${tool.color}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{tool.title}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{tool.description}</p>
                <Button render={<Link href={tool.href} />} variant="ghost" className="w-fit gap-2 p-0 text-primary hover:bg-transparent hover:text-primary/80">
                  Try it free <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
