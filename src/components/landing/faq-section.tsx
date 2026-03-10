"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is JahFrames really free?",
    a: "Yes, 100% free with no hidden costs, no accounts, and no usage limits. All processing happens in your browser.",
  },
  {
    q: "Do you upload my video to a server?",
    a: "No. Your video is processed entirely in your browser using FFmpeg WebAssembly. Nothing is uploaded anywhere. Your files stay on your device.",
  },
  {
    q: "What video formats are supported?",
    a: "MP4, MOV, AVI, WebM, and MKV. Most common video codecs (H.264, H.265, VP8, VP9) are supported.",
  },
  {
    q: "What output formats can I use?",
    a: "PNG (lossless), JPG (smaller files), and WebP (modern, best compression). You can also create GIFs and contact sheets.",
  },
  {
    q: "Is there a file size limit?",
    a: "We support files up to 2GB. For very large files or high frame counts, you may receive a memory warning. Using time ranges helps with large videos.",
  },
  {
    q: "How does scene detection work?",
    a: "We use FFmpeg's scene detection filter to identify visual changes between frames. You can adjust the sensitivity threshold to find more or fewer scene changes.",
  },
  {
    q: "Can I use JahFrames on mobile?",
    a: "Yes, JahFrames is fully responsive. On mobile, frame extraction is limited to 200 frames for memory safety.",
  },
  {
    q: "What is a contact sheet?",
    a: "A contact sheet is a single image showing a grid of evenly-spaced frames from your video, with timestamps and video info. Great for video overviews and documentation.",
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
      </motion.div>

      <Accordion className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm font-medium">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
