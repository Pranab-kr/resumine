"use client";

import Link from "next/link";
import { Moon, Sun, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="navbar">
      <Link href="/">
        <p className="text-2xl font-bold text-gradient">RESUMINE</p>
      </Link>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Link href="/upload">
          <Button className="primary-gradient text-white rounded-full px-4 py-2">
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
        </Link>
      </div>
    </nav>
  );
}
