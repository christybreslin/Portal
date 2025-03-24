"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Generate dummy data for charts
const generateYieldData = () => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    labels,
    datasets: [
      {
        label: 'ETH Yield (%)',
        data: labels.map(() => Math.random() * 5 + 3),
        borderColor: '#5BC470',
        backgroundColor: 'rgba(91, 196, 112, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
};

const generateOperatorData = () => {
  return {
    labels: ['Validator 1', 'Validator 2', 'Validator 3', 'Validator 4', 'Validator 5'],
    datasets: [
      {
        label: 'Performance Score',
        data: [95, 88, 92, 87, 94],
        backgroundColor: '#5BC470',
        borderRadius: 8,
      },
    ],
  };
};

// Chart options
const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyFont: {
        size: 12,
      },
      backgroundColor: 'rgba(0, 31, 63, 0.8)',
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyFont: {
        size: 12,
      },
      backgroundColor: 'rgba(0, 31, 63, 0.8)',
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

// Validator data
const validatorData = [
  { id: 1, name: 'Validator #1', balance: 32.45, operators: 'Operator 1', status: 'Active' },
  { id: 2, name: 'Validator #2', balance: 32.12, operators: 'Operator 2', status: 'Active' },
  { id: 3, name: 'Validator #3', balance: 32.38, operators: 'Operator 1', status: 'Active' },
  { id: 4, name: 'Validator #4', balance: 32.01, operators: 'Operator 3', status: 'Active' },
  { id: 5, name: 'Validator #5', balance: 32.29, operators: 'Operator 2', status: 'Active' },
];

// Metric Card Component
function MetricCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="h-full shadow-sm border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <span className="text-emerald-500">{icon}</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [yieldData, setYieldData] = useState(generateYieldData());
  const [operatorData, setOperatorData] = useState(generateOperatorData());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-[#1a2e22]">Dashboard</h1>
          <p className="text-gray-700 mt-2">
            View performance metrics and analytics for your validators
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Summary Metrics */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Validators"
                value="5"
                subtitle="Across all operators"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>}
              />
              <MetricCard
                title="Total ETH Staked"
                value="161.25"
                subtitle="32 ETH per validator"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>}
              />
              <MetricCard
                title="Current APR"
                value="4.21%"
                subtitle="Annual percentage rate"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>}
              />
              <MetricCard
                title="Total Rewards"
                value="1.65 ETH"
                subtitle="Since inception"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>}
              />
            </div>
          </motion.div>

          {/* Yield Trend */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border border-gray-100 bg-white dark:bg-navy-blue-800 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Yield Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="animate-pulse flex space-x-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <Line options={lineChartOptions} data={yieldData} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Operator Performance */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border border-gray-100 bg-white dark:bg-navy-blue-800 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Operator Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="animate-pulse flex space-x-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <Bar options={barChartOptions} data={operatorData} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Validator List */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border border-gray-100 bg-white dark:bg-navy-blue-800 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Your Validators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Balance</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Operator</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="px-4 py-3">
                              <div className="animate-pulse w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="animate-pulse w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="animate-pulse w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="animate-pulse w-28 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="animate-pulse w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        validatorData.map((validator) => (
                          <tr key={validator.id} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{validator.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{validator.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{validator.balance} ETH</td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{validator.operators}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                {validator.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 
