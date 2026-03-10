import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-extrabold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button render={<Link href="/" />} className="mt-8 gap-2 bg-primary text-primary-foreground" size="lg">
        <Home className="h-4 w-4" />
        Back to Home
      </Button>
    </div>
  );
}
