"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Analytics", path: "/analytics" },
  { name: "Deposit", path: "/deposit" },
];

export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-navy-blue dark:text-white"
                : "text-gray-600 hover:text-navy-blue dark:text-gray-400 dark:hover:text-white"
            )}
          >
            {item.name}
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-bright-blue dark:bg-vibrant-green"
                layoutId="navigation-underline"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
} 