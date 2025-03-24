"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { MobileMenu } from "@/components/ui/mobile-menu";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-navy-blue/90 backdrop-blur-md shadow-md" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Link href="/" className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-200">
            <span className="text-bright-blue">Portal</span>
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden md:block"
        >
          <Navigation className="text-white" />
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-transparent border border-white/20 text-white hover:bg-white/10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <Button className="bg-navy-blue/90 backdrop-blur-md hover:bg-navy-blue hover:shadow-lg text-blue-300 border border-white/10">
              Connect Wallet
            </Button>
          </motion.div>
          
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header; 