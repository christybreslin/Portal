"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

// Navigation items with icons
const navItems = [
  { 
    name: "Home", 
    path: "/", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ) 
  },
  { 
    name: "Dashboard", 
    path: "/dashboard", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ) 
  },
  { 
    name: "Analytics", 
    path: "/analytics", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ) 
  },
  { 
    name: "Deposit", 
    path: "/deposit", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) 
  },
];

interface SidebarProps {
  isMobile?: boolean;
}

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Connect Wallet button
  const ConnectWalletButton = () => (
    <Button className="bg-navy-blue/90 backdrop-blur-md hover:bg-navy-blue hover:shadow-lg text-blue-300 border border-white/10">
      Connect Wallet
    </Button>
  );

  // Common sidebar content
  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex-shrink-0 w-8 h-8 bg-bright-blue rounded-full flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="text-xl font-bold">
            <span className="text-bright-blue">Portal</span>
          </span>
        </Link>
      </div>
      
      <div className="mt-8 flex-1">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center py-3 px-3 rounded-lg transition-colors relative group",
                  isActive
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-white"
                )}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                
                <span className="ml-3 text-sm font-medium">{item.name}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-bright-blue rounded-r-md"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-full bg-sidebar-accent border-0"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5 text-yellow-300" />
            ) : (
              <MoonIcon className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  if (!isMobile) {
    return (
      <div className="h-screen bg-sidebar fixed left-0 top-0 bottom-0 z-40 w-64">
        <SidebarContent />
      </div>
    );
  }

  // Mobile sidebar
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-navy-blue/90 backdrop-blur-md shadow-md px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center text-white">
          <span className="text-xl font-bold">
            <span className="text-bright-blue">Portal</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          <ConnectWalletButton />
          
          <Button
            variant="outline"
            className="w-10 h-10 p-0 border-none bg-transparent"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobileSidebar}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn("transition-opacity duration-300", isMobileOpen ? "opacity-0" : "opacity-100")}
            >
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              />
            </svg>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
                isMobileOpen ? "opacity-100" : "opacity-0"
              )}
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              />
            </svg>
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-sidebar shadow-xl"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
} 