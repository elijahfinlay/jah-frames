import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Film className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                Jah<span className="text-primary">Frames</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Free, browser-based video to frames extraction. No uploads, no login, no limits.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/video-to-frames" className="transition-colors hover:text-foreground">Video to Frames</Link></li>
              <li><Link href="/video-compressor" className="transition-colors hover:text-foreground">Video Compressor</Link></li>
              <li><Link href="/gif-maker" className="transition-colors hover:text-foreground">GIF Maker</Link></li>
              <li><Link href="/contact-sheet" className="transition-colors hover:text-foreground">Contact Sheet</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Formats</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>MP4, MOV, AVI</li>
              <li>WebM, MKV</li>
              <li>PNG, JPG, WebP</li>
              <li>GIF, Sprite Sheet</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Info</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="transition-colors hover:text-foreground">About</Link></li>
              <li><Link href="/about#privacy" className="transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/about#terms" className="transition-colors hover:text-foreground">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JahFrames. 100% client-side processing &mdash; your videos never leave your device.</p>
        </div>
      </div>
    </footer>
  );
}
