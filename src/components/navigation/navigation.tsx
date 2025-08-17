"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          LearnMate
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#about"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="#contact"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
