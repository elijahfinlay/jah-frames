"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers } from "lucide-react";

export function CtaSection() {
  return (
    <section className="border-t border-border/50 bg-gradient-to-b from-muted/30 to-background py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl px-4 text-center sm:px-6"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Layers className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to Extract Frames?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          No sign-up. No upload. Just drag, drop, and go.
        </p>
        <Button
          render={<Link href="/video-to-frames" />}
          size="lg"
          className="mt-8 gap-2 bg-primary px-10 text-lg text-primary-foreground hover:bg-primary/90"
        >
          Get Started Free
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </section>
  );
}
