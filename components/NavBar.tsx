"use client";

import Link from "next/link";
import { Moon, Sun, Upload, Settings, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { usePuterStore } from "@/lib/puter-store";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const { auth } = usePuterStore();

  return (
    <nav className="navbar">
      <Link href="/">
        <p className="text-xl md:text-2xl font-bold text-gradient">RESUMINE</p>
      </Link>
      <div className="flex items-center gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
        <Link href="/upload">
          <HoverBorderGradient className="flex items-center rounded-full px-3 md:px-5">
            <Upload className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Upload Resume</span>
          </HoverBorderGradient>
        </Link>
      </div>
    </nav>
  );
}
