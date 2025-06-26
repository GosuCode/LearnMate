"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          LearnMate
        </Link>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
