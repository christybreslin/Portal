"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function DepositPage() {
  // State for tracking the flow
  const [currentStep, setCurrentStep] = useState<"selection" | "amount" | "avs" | "confirmation" | "structure">("selection");
  const [stakingPath, setStakingPath] = useState<"vanilla" | "eigenlayer" | null>(null);
  
  // State for ETH amount and calculated validators
  const [ethInput, setEthInput] = useState<number>(32);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const [isStandardStructure, setIsStandardStructure] = useState(true);
  const [consolidationLevel, setConsolidationLevel] = useState(0);
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isDelegated, setIsDelegated] = useState<boolean>(true);
  
  // Calculate validators based on ETH input
  const validatorCount = Math.floor(ethInput / 32);
  
  // Handle staking path selection
  const handlePathSelect = (path: "vanilla" | "eigenlayer") => {
    setStakingPath(path);
    setCurrentStep("amount");
  };
  
  // Handle next step navigation
  const handleNextStep = () => {
    if (currentStep === "amount") {
      if (stakingPath === "eigenlayer") {
        setCurrentStep("avs");
      } else {
        setCurrentStep("confirmation");
      }
    } else if (currentStep === "avs") {
      setCurrentStep("confirmation");
    }
  };
  
  // Handle step back
  const handleBackStep = () => {
    if (currentStep === "amount") {
      setCurrentStep("selection");
      setStakingPath(null);
    } else if (currentStep === "avs") {
      setCurrentStep("amount");
    } else if (currentStep === "confirmation") {
      if (stakingPath === "vanilla") {
        setCurrentStep("amount");
      } else {
        setCurrentStep("avs");
      }
    }
  };
  
  // Calculate consolidated keys based on consolidation level
  const getConsolidatedStructure = useMemo(() => {
    if (consolidationLevel === 0) return Array(validatorCount).fill(32);
    
    const maxConsolidation = Math.min(4, Math.floor(validatorCount / 2));
    const level = Math.max(1, Math.min(maxConsolidation, Math.ceil(consolidationLevel * maxConsolidation)));
    
    const validatorsPerKey = Math.pow(2, level);
    const ethPerKey = validatorsPerKey * 32;
    
    const fullKeys = Math.floor(validatorCount / validatorsPerKey);
    const remainder = validatorCount % validatorsPerKey;
    
    const result = Array(fullKeys).fill(ethPerKey);
    if (remainder > 0) result.push(remainder * 32);
    
    return result;
  }, [validatorCount, consolidationLevel]);
  
  const consolidatedKeys = getConsolidatedStructure;
  const totalKeys = isStandardStructure ? validatorCount : consolidatedKeys.length;
  
  // Calculate gas savings (for illustration)
  const gasSavingPercent = isStandardStructure ? 0 : Math.min(75, Math.round((1 - (consolidatedKeys.length / validatorCount)) * 100));
  
  // Handle structure toggle with confetti effect
  const handleStructureToggle = (isStandard: boolean) => {
    if (isStandard !== isStandardStructure) {
      setIsStandardStructure(isStandard);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
  };
  
  // Handle ETH input change
  const handleEthChange = (value: number) => {
    // Round to 2 decimal places
    const rounded = Math.round(value * 100) / 100;
    setEthInput(Math.max(0, rounded));
  };
  
  // Handle slider interaction
  const handleSliderInteraction = (isMoving: boolean) => {
    setIsSliderMoving(isMoving);
  };
  
  // Quick select ETH amount
  const handleQuickSelect = (amount: number) => {
    setEthInput(amount);
  };
  
  // Animation variants
  const validatorVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: (i: number) => ({ 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05, 
        duration: 0.3, 
        type: "spring",
        stiffness: 200
      }
    }),
    exit: { opacity: 0, scale: 0.8, y: 10, transition: { duration: 0.2 } }
  };
  
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
  };
  
  // Define variants for square layout changes
  const squareVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200 } },
    hover: { scale: 1.08, zIndex: 10, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };
  
  // Monthly reward data for the chart
  const monthlyRewards = useMemo(() => {
    const apr = 0.04; // 4% annual rate
    const monthlyRate = apr / 12;
    return Array.from({ length: 12 }, (_, i) => {
      return {
        month: i + 1,
        reward: ethInput * monthlyRate * (i + 1)
      };
    });
  }, [ethInput]);
  
  // Handle consolidation slider interaction
  const handleConsolidationChange = (value: number) => {
    setConsolidationLevel(value);
  };

  // Use effect to track changes to key structure for animation
  useEffect(() => {
    // Reset confetti after 1.5 seconds
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f5e9] to-[#e8eef2]">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif text-[#1a2e22] font-medium">
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

      <main className="container mx-auto px-4 pt-8 pb-16">
        <AnimatePresence mode="wait">
          {currentStep === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-[#1a2e22]">Choose Your Staking Path</h1>
                <p className="mt-4 text-xl text-gray-700">
                  Select the staking solution that aligns with your objectives
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Vanilla Ethereum Staking Option */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="cursor-pointer"
                  onClick={() => handlePathSelect("vanilla")}
                >
                  <Card className="bg-white/80 dark:bg-navy-blue-800/80 backdrop-blur-sm h-full p-8 border border-gray-200 dark:border-gray-700 hover:border-vibrant-green dark:hover:border-vibrant-green transition-all rounded-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-navy-blue/5 to-transparent opacity-50 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
                    
                    <h2 className="text-2xl font-bold text-navy-blue dark:text-white mb-4">Ethereum Staking</h2>
                    <div className="text-gray-600 dark:text-gray-300 mb-6">
                      Traditional Ethereum staking focused on network security and base protocol rewards.
                    </div>
                    
                    <div className="flex items-center text-sm text-navy-blue dark:text-gray-300 space-x-4 mb-6">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-vibrant-green mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Protocol-level security</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-vibrant-green mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Native Ethereum staking</span>
                      </div>
                    </div>
                    
                    <div className="relative h-48 bg-white dark:bg-navy-blue-700 rounded-lg overflow-hidden mb-6">
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {/* Replace SVG with Image component */}
                        <motion.div
                          className="relative w-full h-full"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <Image 
                            src="/images/staking/vanilla-ethereum.svg"
                            alt="Vanilla Ethereum Staking"
                            fill
                            className="object-contain p-4"
                            priority
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      className="flex justify-between items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <span className="text-navy-blue dark:text-white font-medium">Select Vanilla Staking</span>
                      <svg className="w-6 h-6 text-vibrant-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.div>
                  </Card>
                </motion.div>
                
                {/* EigenLayer Staking Option */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="cursor-pointer"
                  onClick={() => handlePathSelect("eigenlayer")}
                >
                  <Card className="bg-white/80 dark:bg-navy-blue-800/80 backdrop-blur-sm h-full p-8 border border-gray-200 dark:border-gray-700 hover:border-vibrant-green dark:hover:border-vibrant-green transition-all rounded-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-vibrant-green/10 to-transparent opacity-50 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
                    
                    <h2 className="text-2xl font-bold text-navy-blue dark:text-white mb-4">EigenLayer Restaking</h2>
                    <div className="text-gray-600 dark:text-gray-300 mb-6">
                      Enhanced staking with restaking capabilities, allowing for additional rewards from AVS services.
                    </div>
                    
                    <div className="flex items-center text-sm text-navy-blue dark:text-gray-300 space-x-4 mb-6">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-vibrant-green mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>~5-7% APR</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-vibrant-green mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Multiple AVS rewards</span>
                      </div>
                    </div>
                    
                    <div className="relative h-48 bg-white dark:bg-navy-blue-700 rounded-lg overflow-hidden mb-6">
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {/* Replace SVG with Image component */}
                        <motion.div
                          className="relative w-full h-full"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <Image 
                            src="/images/staking/eigen-layer.svg"
                            alt="EigenLayer Staking"
                            fill
                            className="object-contain p-4"
                            priority
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      className="flex justify-between items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <span className="text-navy-blue dark:text-white font-medium">Select EigenLayer Staking</span>
                      <svg className="w-6 h-6 text-vibrant-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {currentStep === "amount" && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-8">
                <button
                  onClick={handleBackStep}
                  className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-3xl font-bold text-navy-blue dark:text-white">Select ETH Amount</h1>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - ETH Input */}
                <div className="lg:col-span-2 space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/80 dark:bg-navy-blue-800/80 backdrop-blur-sm rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700"
                  >
                    {/* Dynamic ETH Value Display */}
                    <div className="text-center mb-10">
                      <motion.div 
                        className="text-4xl font-bold text-vibrant-green"
                        key={ethInput}
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        You are staking: <span>{ethInput} ETH</span>
                      </motion.div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {validatorCount} validator{validatorCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {/* Quick Select Buttons */}
                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                      {[32, 64, 128, 256, "Max"].map((amount, i) => (
                        <motion.button
                          key={`quick-${amount}`}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            (amount === "Max" ? 1000 : amount) === ethInput
                              ? 'bg-vibrant-green text-white shadow-md'
                              : 'bg-gray-100 dark:bg-navy-blue-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-blue-600'
                          }`}
                          onClick={() => handleQuickSelect(amount === "Max" ? 1000 : amount as number)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.05 }}
                        >
                          {amount} {amount !== "Max" && "ETH"}
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* Custom Slider */}
                    <div className="mb-6 relative py-2">
                      <div className="relative h-10 group">
                        {/* Empty Track */}
                        <div className="absolute inset-0 h-3 mt-3.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        
                        {/* Filled Track */}
                        <div 
                          className="absolute h-3 mt-3.5 rounded-full bg-emerald-700"
                          style={{ 
                            width: `${Math.min(100, (ethInput / 1000) * 100)}%`,
                            backgroundColor: "#047857"
                          }}
                        ></div>
                        
                        {/* Interactive Slider */}
                        <input 
                          type="range" 
                          min="0" 
                          max="1000" 
                          step="1" 
                          value={ethInput}
                          onChange={(e) => handleEthChange(parseFloat(e.target.value))}
                          className="absolute w-full h-10 opacity-0 cursor-pointer z-10"
                        />
                        
                        {/* Simple Handle */}
                        <div 
                          className="absolute h-8 w-8 rounded-full bg-white border-2 transform -translate-y-1/2 top-1/2"
                          style={{ 
                            left: `calc(${Math.min(100, (ethInput / 1000) * 100)}% - ${Math.min(100, (ethInput / 1000) * 100) / 12.5}px)`,
                            borderColor: "#047857"
                          }}
                        ></div>
                      </div>
                      
                      {/* Tick marks */}
                      <div className="flex justify-between mt-2 px-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>0</span>
                        <span>250</span>
                        <span>500</span>
                        <span>750</span>
                        <span>1000</span>
                      </div>
                    </div>
                    
                    {/* Manual Input */}
                    <div className="flex justify-center mt-6">
                      <div className="text-sm text-navy-blue dark:text-gray-300 bg-gray-50 dark:bg-navy-blue-700/30 px-4 py-2 rounded-lg flex items-center">
                        <svg className="w-4 h-4 text-vibrant-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Running {validatorCount} validators with {ethInput} ETH</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Validator Structure Section for Vanilla Staking */}
                  {stakingPath === "vanilla" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-8 bg-white/80 dark:bg-navy-blue-800/80 backdrop-blur-sm rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <div>
                          <h3 className="text-xl font-semibold text-navy-blue dark:text-white">Validator Key Structure</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                            Select your preferred validator key configuration
                          </p>
                        </div>
                        
                        {/* Structure Toggle */}
                        <div className="mt-4 md:mt-0 flex space-x-2 bg-gray-100 dark:bg-navy-blue-700 p-1 rounded-lg">
                          <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              isStandardStructure
                                ? 'bg-white dark:bg-navy-blue-600 shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-navy-blue-600/30'
                            }`}
                            onClick={() => handleStructureToggle(true)}
                          >
                            Standard (0x01)
                          </button>
                          <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              !isStandardStructure
                                ? 'bg-white dark:bg-navy-blue-600 shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-navy-blue-600/30'
                            }`}
                            onClick={() => handleStructureToggle(false)}
                          >
                            Consolidated (0x02)
                          </button>
                        </div>
                      </div>
                      
                      {/* Option Descriptions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className={`p-4 rounded-lg border ${isStandardStructure ? 'border-vibrant-green bg-vibrant-green/5' : 'border-gray-200 dark:border-gray-700'}`}>
                          <div className="flex items-start mb-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 ${isStandardStructure ? 'bg-vibrant-green' : 'bg-gray-200 dark:bg-gray-700'}`}>
                              {isStandardStructure && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-navy-blue dark:text-white">Standard Validators</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {validatorCount} validators with 32 ETH each
                              </p>
                            </div>
                          </div>
                          <ul className="ml-7 text-sm text-gray-600 dark:text-gray-300 space-y-2 mt-3">
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                              <span>One key per validator</span>
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                              <span>Widely supported</span>
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                              <span>Standard gas costs</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${!isStandardStructure ? 'border-vibrant-green bg-vibrant-green/5' : 'border-gray-200 dark:border-gray-700'}`}>
                          <div className="flex items-start mb-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 ${!isStandardStructure ? 'bg-vibrant-green' : 'bg-gray-200 dark:bg-gray-700'}`}>
                              {!isStandardStructure && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-navy-blue dark:text-white">Consolidated Keys</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {validatorCount} validators in {totalKeys} keys
                              </p>
                            </div>
                          </div>
                          <ul className="ml-7 text-sm text-gray-600 dark:text-gray-300 space-y-2 mt-3">
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                              <span>Reduced key management</span>
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                              <span>Up to {gasSavingPercent}% gas savings</span>
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                              <span>Advanced security features</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      {!isStandardStructure && (
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-navy-blue dark:text-white">Consolidation Level</h4>
                            <div className="flex items-center space-x-2">
                              <div className="px-2 py-1 bg-navy-blue/10 dark:bg-navy-blue-600/50 rounded-md text-xs text-navy-blue dark:text-white">
                                {validatorCount} validators
                              </div>
                              <div className="px-2 py-1 bg-vibrant-green/10 dark:bg-vibrant-green/20 rounded-md text-xs text-vibrant-green">
                                {totalKeys} keys
                              </div>
                            </div>
                          </div>
                          
                          {/* Consolidation Slider */}
                          <div className="relative h-10 group">
                            {/* Empty Track */}
                            <div className="absolute inset-0 h-3 mt-3.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            
                            {/* Filled Track */}
                            <div 
                              className="absolute h-3 mt-3.5 rounded-full bg-emerald-700"
                              style={{ 
                                width: `${consolidationLevel * 100}%`,
                                backgroundColor: "#047857"
                              }}
                            ></div>
                            
                            {/* Interactive Slider */}
                            <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.01" 
                              value={consolidationLevel}
                              onChange={(e) => handleConsolidationChange(parseFloat(e.target.value))}
                              className="absolute w-full h-10 opacity-0 cursor-pointer z-10"
                            />
                            
                            {/* Simple Handle */}
                            <div 
                              className="absolute h-8 w-8 rounded-full bg-white border-2 transform -translate-y-1/2 top-1/2"
                              style={{ 
                                left: `calc(${consolidationLevel * 100}% - ${consolidationLevel * 8}px)`,
                                borderColor: "#047857"
                              }}
                            ></div>
                          </div>
                          
                          {/* Slider Labels */}
                          <div className="flex justify-between mt-2 px-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>Min Consolidation</span>
                            <span>Max Consolidation</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Key Visualization */}
                      <div className="mt-10">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-navy-blue dark:text-white">Validator Keys Visualization</h4>
                          {validatorCount > 10 && (
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Showing representative sample
                            </div>
                          )}
                        </div>
                        
                        {/* Visual legend */}
                        <div className="flex flex-wrap items-center mb-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-navy-blue-700/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center mr-4 mb-1">
                            <div className="w-4 h-4 bg-[#B8EFCB] rounded-sm mr-1"></div>
                            <span>Standard validator (32 ETH)</span>
                          </div>
                          {!isStandardStructure && (
                            <>
                              <div className="flex items-center mr-4 mb-1">
                                <div className="w-4 h-4 bg-[#5BC470] rounded-sm mr-1"></div>
                                <span>Medium consolidated (64-128 ETH)</span>
                              </div>
                              <div className="flex items-center mb-1">
                                <div className="w-4 h-4 bg-[#3A9D70] rounded-sm mr-1"></div>
                                <span>Large consolidated ({'>'}128 ETH)</span>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Square grid visualization */}
                        <div className="mt-8 p-6 bg-gray-50 dark:bg-navy-blue-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                          <div className="mb-4">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium text-navy-blue dark:text-white">Validator Key Structure</h4>
                              <div className="bg-gray-50 dark:bg-navy-blue-600/50 px-2 py-1 rounded-md text-xs text-navy-blue dark:text-gray-200 flex items-center">
                                <span className="font-medium">{validatorCount}</span>
                                <span className="ml-1">validators</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Consolidation Efficiency Visual */}
                          {!isStandardStructure && (
                            /* Empty element instead of the efficiency bar */
                            <div className="mb-6"></div>
                          )}
                          
                          {/* Square grid */}
                          <motion.div
                            variants={containerVariants}
                            initial="initial"
                            animate="animate"
                            className="flex flex-wrap gap-3"
                            layout
                          >
                            {(isStandardStructure ? Array(Math.min(validatorCount, 40)).fill(32) : consolidatedKeys.slice(0, Math.min(consolidatedKeys.length, 40))).map((value, i) => {
                              const validators = value / 32;
                              const isConsolidated = validators > 1;
                              const isLargeConsolidated = validators > 4;
                              
                              // Calculate size based on ETH value (square root for proportional area)
                              const baseSize = 40; // Size for 32 ETH
                              const size = Math.max(baseSize, Math.sqrt(value / 32) * baseSize);
                              
                              // Determine color based on size
                              let bgColor;
                              if (!isConsolidated) {
                                bgColor = "#B8EFCB"; // Light green for standard
                              } else if (isLargeConsolidated) {
                                bgColor = "#3A9D70"; // Deep emerald for large consolidated
                              } else {
                                bgColor = "#5BC470"; // Bright green for medium consolidated
                              }
                              
                              return (
                                <motion.div
                                  key={`key-square-${i}`}
                                  layout
                                  variants={squareVariants}
                                  initial="initial"
                                  animate="animate"
                                  whileHover="hover"
                                  whileTap="tap"
                                  className="relative group cursor-pointer"
                                  style={{
                                    width: `${size}px`,
                                    height: `${size}px`
                                  }}
                                  transition={{
                                    layout: { type: "spring", stiffness: 200, damping: 20 }
                                  }}
                                >
                                  <motion.div 
                                    className="absolute inset-0 rounded-lg bg-white dark:bg-gray-700 shadow-md border border-white/20 dark:border-gray-600/20 overflow-hidden"
                                    style={{ background: bgColor }}
                                    layout
                                  >
                                    {/* Gloss effect */}
                                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/30 rounded-t-lg"></div>
                                    
                                    {/* Subtle inner shadow */}
                                    <div className="absolute inset-0 shadow-inner"></div>
                                    
                                    {/* Pulsating border on hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 border-2 border-white dark:border-vibrant-green rounded-lg animate-pulse-fast"></div>
                                  </motion.div>
                                  
                                  {/* Label for larger squares */}
                                  {size > 50 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white dark:text-white/90">
                                      {validators > 1 ? `${value} ETH` : ''}
                                    </div>
                                  )}
                                  
                                  {/* Tooltip */}
                                  <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-navy-blue dark:bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-20 pointer-events-none transition-opacity">
                                    Key #{i+1} — {value} ETH 
                                    {validators !== 1 && ` (${validators} validators)`}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-navy-blue dark:bg-gray-800"></div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                          
                          {/* Additional information for consolidated view */}
                          {!isStandardStructure && (
                            <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                              <div className="flex items-start">
                                <svg className="w-5 h-5 text-vibrant-green mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <div>
                                  <div className="font-medium text-navy-blue dark:text-white">Efficiency Improvements</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    Consolidating {validatorCount} validators into {totalKeys} deposit key{totalKeys !== 1 ? 's' : ''} 
                                    reduces management complexity by {Math.round((1 - (totalKeys / validatorCount)) * 100)}% and 
                                    saves approximately {gasSavingPercent}% in gas costs.
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Estimated Rewards Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 bg-white/50 dark:bg-navy-blue-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700 hidden"
                  >
                    <h3 className="text-lg font-semibold text-navy-blue dark:text-white mb-4">Estimated Rewards</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 p-4 rounded-lg bg-white/70 dark:bg-navy-blue-700/70 border border-gray-100 dark:border-gray-600">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Annual ETH Rewards</div>
                        <div className="text-2xl font-bold text-vibrant-green mt-1">{(ethInput * 0.04).toFixed(2)} ETH</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">At current network APR (~4%)</div>
                      </div>
                      
                      {stakingPath === "eigenlayer" && (
                        <div className="flex-1 p-4 rounded-lg bg-white/70 dark:bg-navy-blue-700/70 border border-gray-100 dark:border-gray-600">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Additional AVS Rewards</div>
                          <div className="text-2xl font-bold text-vibrant-green mt-1">+{(ethInput * 0.015).toFixed(2)} ETH</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Estimated AVS rewards (~1.5%)</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                {/* Right Column - Summary */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="lg:sticky lg:top-8 self-start"
                >
                  <div className="bg-white/70 dark:bg-navy-blue-800/70 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-navy-blue dark:text-white mb-6">Staking Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">Staking path</span>
                        <span className="font-semibold text-navy-blue dark:text-white">
                          {stakingPath === "vanilla" ? "Vanilla Ethereum" : "EigenLayer"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">Total ETH to stake</span>
                        <span className="text-xl font-bold text-vibrant-green">{ethInput} ETH</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">Validator count</span>
                        <span className="font-semibold text-navy-blue dark:text-white">{validatorCount}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">Minimum required</span>
                        <span className="font-semibold text-navy-blue dark:text-white">32 ETH</span>
                      </div>
                      
                      {stakingPath === "vanilla" && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Key structure</span>
                          <span className="font-semibold text-navy-blue dark:text-white">
                            {isStandardStructure ? 'Standard (0x01)' : 'Consolidated (0x02)'}
                          </span>
                        </div>
                      )}
                      
                      {stakingPath === "vanilla" && !isStandardStructure && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Deposit keys</span>
                          <span className="font-semibold text-navy-blue dark:text-white">{totalKeys}</span>
                        </div>
                      )}
                      
                      {stakingPath === "vanilla" && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Gas savings</span>
                          <span className="font-semibold text-vibrant-green">
                            {isStandardStructure ? '0%' : `~${gasSavingPercent}%`}
                          </span>
                        </div>
                      )}
                      
                      <div className="py-3 px-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-xs text-blue-600 dark:text-blue-300">
                              {isStandardStructure 
                                ? "Standard validators use individual deposit keys (0x01 type). This is the traditional approach."
                                : "Consolidated keys combine multiple validators, reducing overhead and gas costs (0x02 type)."}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {ethInput < 32 ? (
                        <div className="py-3 px-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg mt-4">
                          <div className="flex items-start">
                            <svg className="w-4 h-4 text-red-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-red-600 dark:text-red-400">Minimum requirement not met</div>
                              <div className="text-xs text-red-500 dark:text-red-300 mt-1">You need at least 32 ETH to stake</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 px-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg mt-4 mb-4">
                          <div className="flex items-start">
                            <svg className="w-4 h-4 text-vibrant-green mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-vibrant-green">Ready to proceed</div>
                              <div className="text-xs text-green-600 dark:text-green-300 mt-1">Your stake meets all requirements</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Navigation Button with gradient */}
                      {ethInput >= 32 && (
                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: "#5BC470" }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-6 py-3 bg-white dark:bg-gray-800 text-navy-blue dark:text-white font-bold rounded-xl shadow-md border border-gray-200 dark:border-gray-600 transition-all hover:text-white"
                          onClick={handleNextStep}
                        >
                          Continue to {stakingPath === "vanilla" ? "Confirmation" : "AVS Selection"}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {currentStep === "structure" && (
            <motion.div
              key="structure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-8">
                <button
                  onClick={handleBackStep}
                  className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-3xl font-bold text-navy-blue dark:text-white">Validator Structure</h1>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Structure Selection & Visualization */}
                <div className="lg:col-span-2 space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/80 dark:bg-navy-blue-800/80 backdrop-blur-sm rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                      <div>
                        <h3 className="text-xl font-semibold text-navy-blue dark:text-white">Validator Key Structure</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                          Select your preferred validator key configuration
                        </p>
                      </div>
                      
                      {/* Structure Toggle */}
                      <div className="mt-4 md:mt-0 flex space-x-2 bg-gray-100 dark:bg-navy-blue-700 p-1 rounded-lg">
                        <button
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            isStandardStructure
                              ? 'bg-white dark:bg-navy-blue-600 shadow-sm'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-navy-blue-600/30'
                          }`}
                          onClick={() => handleStructureToggle(true)}
                        >
                          Standard (0x01)
                        </button>
                        <button
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            !isStandardStructure
                              ? 'bg-white dark:bg-navy-blue-600 shadow-sm'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-navy-blue-600/30'
                          }`}
                          onClick={() => handleStructureToggle(false)}
                        >
                          Consolidated (0x02)
                        </button>
                      </div>
                    </div>
                    
                    {/* Option Descriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className={`p-4 rounded-lg border ${isStandardStructure ? 'border-vibrant-green bg-vibrant-green/5' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="flex items-start mb-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 ${isStandardStructure ? 'bg-vibrant-green' : 'bg-gray-200 dark:bg-gray-700'}`}>
                            {isStandardStructure && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-navy-blue dark:text-white">Standard Validators</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {validatorCount} validators with 32 ETH each
                            </p>
                          </div>
                        </div>
                        <ul className="ml-7 text-sm text-gray-600 dark:text-gray-300 space-y-2 mt-3">
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                            <span>One key per validator</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                            <span>Widely supported</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                            <span>Standard gas costs</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className={`p-4 rounded-lg border ${!isStandardStructure ? 'border-vibrant-green bg-vibrant-green/5' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="flex items-start mb-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 ${!isStandardStructure ? 'bg-vibrant-green' : 'bg-gray-200 dark:bg-gray-700'}`}>
                            {!isStandardStructure && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-navy-blue dark:text-white">Consolidated Keys</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {validatorCount} validators in {totalKeys} keys
                            </p>
                          </div>
                        </div>
                        <ul className="ml-7 text-sm text-gray-600 dark:text-gray-300 space-y-2 mt-3">
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                            <span>Reduced key management</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                            <span>Up to {gasSavingPercent}% gas savings</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-navy-blue dark:bg-gray-300 rounded-full mr-2.5"></span>
                            <span>Advanced security features</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    {!isStandardStructure && (
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-navy-blue dark:text-white">Consolidation Level</h4>
                          <div className="flex items-center space-x-2">
                            <div className="px-2 py-1 bg-navy-blue/10 dark:bg-navy-blue-600/50 rounded-md text-xs text-navy-blue dark:text-white">
                              {validatorCount} validators
                            </div>
                            <div className="px-2 py-1 bg-vibrant-green/10 dark:bg-vibrant-green/20 rounded-md text-xs text-vibrant-green">
                              {totalKeys} keys
                            </div>
                          </div>
                        </div>
                        
                        {/* Consolidation Slider */}
                        <div className="relative h-10 group">
                          {/* Empty Track */}
                          <div className="absolute inset-0 h-3 mt-3.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          
                          {/* Filled Track */}
                          <div 
                            className="absolute h-3 mt-3.5 rounded-full bg-emerald-700"
                            style={{ 
                              width: `${consolidationLevel * 100}%`,
                              backgroundColor: "#047857"
                            }}
                          ></div>
                          
                          {/* Interactive Slider */}
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={consolidationLevel}
                            onChange={(e) => handleConsolidationChange(parseFloat(e.target.value))}
                            className="absolute w-full h-10 opacity-0 cursor-pointer z-10"
                          />
                          
                          {/* Simple Handle */}
                          <div 
                            className="absolute h-8 w-8 rounded-full bg-white border-2 transform -translate-y-1/2 top-1/2"
                            style={{ 
                              left: `calc(${consolidationLevel * 100}% - ${consolidationLevel * 8}px)`,
                              borderColor: "#047857"
                            }}
                          ></div>
                        </div>
                        
                        {/* Slider Labels */}
                        <div className="flex justify-between mt-2 px-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>Min Consolidation</span>
                          <span>Max Consolidation</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Key Visualization */}
                    <div className="mt-10">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-navy-blue dark:text-white">Validator Keys Visualization</h4>
                        {validatorCount > 10 && (
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Showing representative sample
                          </div>
                        )}
                      </div>
                      
                      {/* Visual legend */}
                      <div className="flex flex-wrap items-center mb-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-navy-blue-700/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center mr-4 mb-1">
                          <div className="w-4 h-4 bg-[#B8EFCB] rounded-sm mr-1"></div>
                          <span>Standard validator (32 ETH)</span>
                        </div>
                        {!isStandardStructure && (
                          <>
                            <div className="flex items-center mr-4 mb-1">
                              <div className="w-4 h-4 bg-[#5BC470] rounded-sm mr-1"></div>
                              <span>Medium consolidated (64-128 ETH)</span>
                            </div>
                            <div className="flex items-center mb-1">
                              <div className="w-4 h-4 bg-[#3A9D70] rounded-sm mr-1"></div>
                              <span>Large consolidated ({'>'}128 ETH)</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Square grid visualization */}
                      <div className="mt-8 p-6 bg-gray-50 dark:bg-navy-blue-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="mb-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-navy-blue dark:text-white">Validator Key Structure</h4>
                            <div className="bg-gray-50 dark:bg-navy-blue-600/50 px-2 py-1 rounded-md text-xs text-navy-blue dark:text-gray-200 flex items-center">
                              <span className="font-medium">{validatorCount}</span>
                              <span className="ml-1">validators</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Consolidation Efficiency Visual */}
                        {!isStandardStructure && (
                          /* Empty element instead of the efficiency bar */
                          <div className="mb-6"></div>
                        )}
                        
                        {/* Square grid */}
                        <motion.div
                          variants={containerVariants}
                          initial="initial"
                          animate="animate"
                          className="flex flex-wrap gap-3"
                          layout
                        >
                          {(isStandardStructure ? Array(Math.min(validatorCount, 40)).fill(32) : consolidatedKeys.slice(0, Math.min(consolidatedKeys.length, 40))).map((value, i) => {
                            const validators = value / 32;
                            const isConsolidated = validators > 1;
                            const isLargeConsolidated = validators > 4;
                            
                            // Calculate size based on ETH value (square root for proportional area)
                            const baseSize = 40; // Size for 32 ETH
                            const size = Math.max(baseSize, Math.sqrt(value / 32) * baseSize);
                            
                            // Determine color based on size
                            let bgColor;
                            if (!isConsolidated) {
                              bgColor = "#B8EFCB"; // Light green for standard
                            } else if (isLargeConsolidated) {
                              bgColor = "#3A9D70"; // Deep emerald for large consolidated
                            } else {
                              bgColor = "#5BC470"; // Bright green for medium consolidated
                            }
                            
                            return (
                              <motion.div
                                key={`key-square-${i}`}
                                layout
                                variants={squareVariants}
                                initial="initial"
                                animate="animate"
                                whileHover="hover"
                                whileTap="tap"
                                className="relative group cursor-pointer"
                                style={{
                                  width: `${size}px`,
                                  height: `${size}px`
                                }}
                                transition={{
                                  layout: { type: "spring", stiffness: 200, damping: 20 }
                                }}
                              >
                                <motion.div 
                                  className="absolute inset-0 rounded-lg bg-white dark:bg-gray-700 shadow-md border border-white/20 dark:border-gray-600/20 overflow-hidden"
                                  style={{ background: bgColor }}
                                  layout
                                >
                                  {/* Gloss effect */}
                                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/30 rounded-t-lg"></div>
                                  
                                  {/* Subtle inner shadow */}
                                  <div className="absolute inset-0 shadow-inner"></div>
                                  
                                  {/* Pulsating border on hover */}
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 border-2 border-white dark:border-vibrant-green rounded-lg animate-pulse-fast"></div>
                                </motion.div>
                                
                                {/* Label for larger squares */}
                                {size > 50 && (
                                  <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white dark:text-white/90">
                                    {validators > 1 ? `${value} ETH` : ''}
                                  </div>
                                )}
                                
                                {/* Tooltip */}
                                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-navy-blue dark:bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-20 pointer-events-none transition-opacity">
                                  Key #{i+1} — {value} ETH 
                                  {validators !== 1 && ` (${validators} validators)`}
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-navy-blue dark:bg-gray-800"></div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                        
                        {/* Additional information for consolidated view */}
                        {!isStandardStructure && (
                          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                            <div className="flex items-start">
                              <svg className="w-5 h-5 text-vibrant-green mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <div>
                                <div className="font-medium text-navy-blue dark:text-white">Efficiency Improvements</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  Consolidating {validatorCount} validators into {totalKeys} deposit key{totalKeys !== 1 ? 's' : ''} 
                                  reduces management complexity by {Math.round((1 - (totalKeys / validatorCount)) * 100)}% and 
                                  saves approximately {gasSavingPercent}% in gas costs.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Right Column - Summary */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="lg:sticky lg:top-8 self-start"
                >
                  <div className="bg-white/70 dark:bg-navy-blue-800/70 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-navy-blue dark:text-white mb-6">Staking Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">Staking path</span>
                        <span className="font-semibold text-navy-blue dark:text-white">
                          {stakingPath === "vanilla" ? "Vanilla Ethereum" : "EigenLayer"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">Total ETH to stake</span>
                        <span className="text-xl font-bold text-vibrant-green">{ethInput} ETH</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">Validator count</span>
                        <span className="font-semibold text-navy-blue dark:text-white">{validatorCount}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">Minimum required</span>
                        <span className="font-semibold text-navy-blue dark:text-white">32 ETH</span>
                      </div>
                      
                      {stakingPath === "vanilla" && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Key structure</span>
                          <span className="font-semibold text-navy-blue dark:text-white">
                            {isStandardStructure ? 'Standard (0x01)' : 'Consolidated (0x02)'}
                          </span>
                        </div>
                      )}
                      
                      {stakingPath === "vanilla" && !isStandardStructure && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Deposit keys</span>
                          <span className="font-semibold text-navy-blue dark:text-white">{totalKeys}</span>
                        </div>
                      )}
                      
                      {stakingPath === "vanilla" && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300">Gas savings</span>
                          <span className="font-semibold text-vibrant-green">
                            {isStandardStructure ? '0%' : `~${gasSavingPercent}%`}
                          </span>
                        </div>
                      )}
                      
                      <div className="py-3 px-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-xs text-blue-600 dark:text-blue-300">
                              {isStandardStructure 
                                ? "Standard validators use individual deposit keys (0x01 type). This is the traditional approach."
                                : "Consolidated keys combine multiple validators, reducing overhead and gas costs (0x02 type)."}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {ethInput < 32 ? (
                        <div className="py-3 px-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg mt-4">
                          <div className="flex items-start">
                            <svg className="w-4 h-4 text-red-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-red-600 dark:text-red-400">Minimum requirement not met</div>
                              <div className="text-xs text-red-500 dark:text-red-300 mt-1">You need at least 32 ETH to stake</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 px-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg mt-4 mb-4">
                          <div className="flex items-start">
                            <svg className="w-4 h-4 text-vibrant-green mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-vibrant-green">Ready to proceed</div>
                              <div className="text-xs text-green-600 dark:text-green-300 mt-1">Your stake meets all requirements</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Navigation Button with gradient */}
                      {ethInput >= 32 && (
                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: "#5BC470" }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-6 py-3 bg-white dark:bg-gray-800 text-navy-blue dark:text-white font-bold rounded-xl shadow-md border border-gray-200 dark:border-gray-600 transition-all hover:text-white"
                          onClick={handleNextStep}
                        >
                          Continue to {stakingPath === "vanilla" ? "Confirmation" : "AVS Selection"}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {currentStep === "avs" && (
            <motion.div
              key="avs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-8">
                <button
                  onClick={handleBackStep}
                  className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-3xl font-bold text-navy-blue dark:text-white">Operator Delegation</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* EigenPod Deployment Info Box */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/80 dark:bg-navy-blue-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-navy-blue dark:text-white">EigenPod Deployment Required</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          Your first transaction will initiate the deployment of a new EigenPod that will be used to restake the selected amount of ETH. You only need to do this once per wallet.
                        </p>
                        <a href="#" className="mt-3 inline-flex items-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                          Learn more
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  {/* AVS Selection Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/80 dark:bg-navy-blue-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
                  >
                    {/* Bitwise Delegation Toggle */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-semibold text-navy-blue dark:text-white">Delegate to Bitwise</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Enable delegation to Bitwise-operated validators</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={isDelegated}
                          onChange={(e) => setIsDelegated(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#5BC470] transition-colors duration-200"></div>
                      </label>
                    </div>

                    {/* Supported AVSs Section */}
                    <div className="mt-8">
                      <h4 className="text-lg font-medium text-navy-blue dark:text-white mb-4">Supported Active Validation Services</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: "EigenDA", logo: "/images/AVS/eigen.svg", description: "Data availability service" },
                          { name: "Cyber", logo: "/images/AVS/cyber.svg", description: "Zero-knowledge proofs" },
                          { name: "Ungate", logo: "/images/AVS/ungate.svg", description: "Cross-chain data" },
                          { name: "Hyperlane", logo: "/images/AVS/hyperlane.svg", description: "Cross-chain messaging" }
                        ].map((avs, index) => (
                          <motion.div
                            key={avs.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-navy-blue-700/30"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-white dark:bg-navy-blue-600 flex items-center justify-center">
                                <Image
                                  src={avs.logo}
                                  alt={avs.name}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                  priority
                                  unoptimized
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-navy-blue dark:text-white">{avs.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{avs.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="lg:sticky lg:top-8 self-start"
                >
                  <div className="bg-white/70 dark:bg-navy-blue-800/70 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-navy-blue dark:text-white mb-6">Delegation Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">Total ETH to stake</span>
                        <span className="text-xl font-bold text-vibrant-green">{ethInput} ETH</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-300">EigenPod status</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">New deployment required</span>
                      </div>

                      <div className="py-3 px-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-xs text-blue-600 dark:text-blue-300">
                              Your ETH will be restaked through EigenLayer and delegated to Bitwise-operated validators.
                            </div>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-3 bg-white dark:bg-gray-800 text-navy-blue dark:text-white font-bold rounded-xl shadow-md border border-gray-200 dark:border-gray-600 transition-all hover:bg-vibrant-green hover:text-white"
                        onClick={handleNextStep}
                      >
                        Delegate to Bitwise
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {currentStep === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Confirmation content */}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
