"use client";

import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) return null;

    
  return (
    <div>
    {theme === "dark" ? (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className="rounded-full"
      >
        <Sun className="text-zinc-400" />
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className="hover:!bg-zinc-200 rounded-full"
      >
        <Moon className="text-zinc-500" />
      </Button>
    )}
  </div>
  )
}