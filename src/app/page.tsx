"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  })
};

export default function Home() {
  const [animateBackground, setAnimateBackground] = useState(false);

  useEffect(() => {
    setAnimateBackground(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f5e9] to-[#e8eef2]">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-4xl font-serif text-[#1a2e22] font-medium">
            Bitwise
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-sm uppercase tracking-wider text-gray-700 font-medium">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-sm uppercase tracking-wider text-gray-700 font-medium">
              Analytics
            </Link>
            <Link href="/deposit" className="text-sm uppercase tracking-wider text-gray-700 font-medium">
              Deposit
            </Link>
            <Link href="#" className="text-sm uppercase tracking-wider text-gray-700 font-medium">
              Support
            </Link>
            <Link
              href="#"
              className="text-sm uppercase tracking-wider bg-emerald-500 text-white px-4 py-2 rounded-md font-medium"
            >
              Connect Wallet
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-12 pb-16">
        <div className="mb-16">
          <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
            <motion.div
              className="inline-block py-1 px-3 bg-emerald-500/10 rounded-full mb-4"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <span className="text-emerald-500 font-medium">Institutional Grade Staking</span>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-[#1a2e22] text-7xl md:text-8xl font-bold mb-4"
            >
    
            </motion.h1>

            <motion.h2
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-[#1a2e22] text-3xl font-serif mb-4"
            >
              Validator Portal
            </motion.h2>

            <motion.p
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-gray-700 mb-8 max-w-2xl"
            >
              Bitwise offers a professional staking infrastructure with EigenLayer integration for enhanced yields. The
              platform offers advanced analytics, real-time monitoring, and institutional-grade security for maximizing
              your Ethereum staking returns.
            </motion.p>

            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn}>
              <Link href="/deposit" className="inline-block bg-emerald-500 text-white px-6 py-3 rounded-md font-medium">
                START STAKING
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link href="/deposit">
            <div className="bg-white dark:bg-navy-blue-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 h-full border border-gray-100 hover:border-emerald-500/30 dark:border-gray-700 text-center transform hover:-translate-y-1 cursor-pointer group">
              <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1a2e22] dark:text-white mb-3">Deposit ETH</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Start staking your ETH with our secure validators and earn rewards.</p>
              <div className="text-emerald-500 font-medium flex items-center justify-center">
                <span>Start Staking</span>
                <svg
                  className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/dashboard">
            <div className="bg-white dark:bg-navy-blue-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 h-full border border-gray-100 hover:border-emerald-500/30 dark:border-gray-700 text-center transform hover:-translate-y-1 cursor-pointer group">
              <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1a2e22] dark:text-white mb-3">Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Monitor your validators and track your staking performance.</p>
              <div className="text-emerald-500 font-medium flex items-center justify-center">
                <span>View Dashboard</span>
                <svg
                  className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/analytics">
            <div className="bg-white dark:bg-navy-blue-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 h-full border border-gray-100 hover:border-emerald-500/30 dark:border-gray-700 text-center transform hover:-translate-y-1 cursor-pointer group">
              <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all duration-300">
                <svg
                  className="w-8 h-8 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1a2e22] dark:text-white mb-3">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Deep insights into your rewards, performance metrics and trends.</p>
              <div className="text-emerald-500 font-medium flex items-center justify-center">
                <span>View Analytics</span>
                <svg
                  className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-emerald-500">3.25%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Base ETH APY</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-emerald-500">4.75%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">With EigenLayer</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-emerald-500">25k+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Validators</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-emerald-500">800k+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">ETH Staked</div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-navy-blue-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:border-emerald-500/30 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#1a2e22] dark:text-white mb-4">Get Started Today</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of stakers who trust our platform for secure, reliable Ethereum staking with enhanced
                returns through EigenLayer integration.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Non-custodial staking solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Enhanced yields with EigenLayer</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Advanced security measures</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Real-time performance monitoring</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/deposit">
                <div className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 rounded-md text-white py-4 px-8 flex items-center group hover:shadow-md transform hover:scale-[1.02]">
                  <span className="text-lg font-medium mr-2">Start Staking Now</span>
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>

        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
          The Validator Portal ETF (ETHV) is not suitable for all investors. An investment in the Fund is subject to a
          high degree of risk, has the potential for significant volatility, and could result in significant or complete
          loss of investment. Please see important information at the bottom of this page to learn more about the risks
          associated with an investment in ETHV. The Fund is not an investment company registered under the Investment
          Company Act of 1940 (the "1940 Act") and therefore is not subject to the same protections as mutual funds or
          ETFs registered under the 1940 Act.
        </p>
      </main>
    </div>
  );
}
