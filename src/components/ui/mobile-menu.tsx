"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Analytics", path: "/analytics" },
  { name: "Deposit", path: "/deposit" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="block md:hidden">
      <Button
        variant="outline"
        className="w-10 h-10 p-0 border-none bg-transparent"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("transition-all duration-300", isOpen ? "opacity-0" : "opacity-100")}
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
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
            isOpen ? "opacity-100" : "opacity-0"
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 right-0 bg-navy-blue/95 backdrop-blur-md shadow-lg z-40 overflow-hidden"
          >
            <div className="px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "px-4 py-2 text-lg font-medium relative",
                        isActive
                          ? "text-bright-blue"
                          : "text-white hover:text-bright-blue transition-colors"
                      )}
                      onClick={closeMenu}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-navigation-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-bright-blue rounded-r-md"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <Button className="w-full py-6 bg-navy-blue/90 backdrop-blur-md hover:bg-navy-blue hover:shadow-lg text-blue-300 border border-white/10 text-lg">
                  Connect Wallet
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 