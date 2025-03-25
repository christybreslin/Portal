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
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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
  { id: 1, name: 'Validator #1', balance: 32.45, status: 'Active', withdrawalType: '0x01' },
  { id: 2, name: 'Validator #2', balance: 32.12, status: 'Active', withdrawalType: '0x01' },
  { id: 3, name: 'Validator #3', balance: 32.38, status: 'Active', withdrawalType: '0x01' },
  { id: 4, name: 'Validator #4', balance: 32.01, status: 'Active', withdrawalType: '0x01' },
  { id: 5, name: 'Validator #5', balance: 32.29, status: 'Active', withdrawalType: '0x01' },
  { id: 6, name: 'Validator #6', balance: 32.15, status: 'Active', withdrawalType: '0x01' },
  { id: 7, name: 'Validator #7', balance: 32.42, status: 'Active', withdrawalType: '0x01' },
  { id: 8, name: 'Validator #8', balance: 32.33, status: 'Active', withdrawalType: '0x01' },
  { id: 9, name: 'Validator #9', balance: 32.28, status: 'Active', withdrawalType: '0x01' },
  { id: 10, name: 'Validator #10', balance: 32.19, status: 'Active', withdrawalType: '0x01' },
  { id: 11, name: 'Validator #11', balance: 32.47, status: 'Active', withdrawalType: '0x01' },
  { id: 12, name: 'Validator #12', balance: 32.31, status: 'Active', withdrawalType: '0x01' },
  { id: 13, name: 'Validator #13', balance: 256.24, status: 'Active', withdrawalType: '0x02' },
  { id: 14, name: 'Validator #14', balance: 512.36, status: 'Active', withdrawalType: '0x02' },
  { id: 15, name: 'Validator #15', balance: 1024.41, status: 'Active', withdrawalType: '0x02' },
  { id: 16, name: 'Validator #16', balance: 2048.27, status: 'Active', withdrawalType: '0x02' },
  { id: 17, name: 'Validator #17', balance: 128.34, status: 'Active', withdrawalType: '0x02' },
  { id: 18, name: 'Validator #18', balance: 64.22, status: 'Active', withdrawalType: '0x02' },
  { id: 19, name: 'Validator #19', balance: 32.39, status: 'Active', withdrawalType: '0x02' },
  { id: 20, name: 'Validator #20', balance: 32.16, status: 'Active', withdrawalType: '0x02' },
  { id: 21, name: 'Validator #21', balance: 32.43, status: 'Active', withdrawalType: '0x02' },
  { id: 22, name: 'Validator #22', balance: 32.30, status: 'Active', withdrawalType: '0x02' },
  { id: 23, name: 'Validator #23', balance: 32.25, status: 'Active', withdrawalType: '0x02' },
  { id: 24, name: 'Validator #24', balance: 32.37, status: 'Active', withdrawalType: '0x02' },
  { id: 25, name: 'Validator #25', balance: 32.21, status: 'Active', withdrawalType: '0x02' },
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

// Key Composition Component
function KeyCompositionCard() {
  const type01Count = validatorData.filter(v => v.withdrawalType === '0x01').length;
  const type02Count = validatorData.filter(v => v.withdrawalType === '0x02').length;
  const total = type01Count + type02Count;
  const type01Percentage = (type01Count / total) * 100;
  const type02Percentage = (type02Count / total) * 100;

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="h-full shadow-sm border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Key Composition</h3>
            <span className="text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </span>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div 
                  className="bg-blue-500 transition-all duration-500"
                  style={{ width: `${type01Percentage}%` }}
                />
                <div 
                  className="bg-purple-500 transition-all duration-500"
                  style={{ width: `${type02Percentage}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">0x01 ({type01Count})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-600 dark:text-gray-400">0x02 ({type02Count})</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Add this after the KeyCompositionCard component
function BalanceDistributionCard() {
  const balanceRanges = {
    '32-33': validatorData.filter(v => v.balance >= 32 && v.balance < 33).length,
    '33-100': validatorData.filter(v => v.balance >= 33 && v.balance < 100).length,
    '100-500': validatorData.filter(v => v.balance >= 100 && v.balance < 500).length,
    '500-2048': validatorData.filter(v => v.balance >= 500 && v.balance <= 2048).length,
  };

  const data = {
    labels: Object.keys(balanceRanges),
    datasets: [{
      data: Object.values(balanceRanges),
      backgroundColor: [
        'rgba(91, 196, 112, 0.8)', // emerald
        'rgba(59, 130, 246, 0.8)', // blue
        'rgba(168, 85, 247, 0.8)', // purple
        'rgba(245, 158, 11, 0.8)', // amber
      ],
      borderColor: [
        'rgb(91, 196, 112)',
        'rgb(59, 130, 246)',
        'rgb(168, 85, 247)',
        'rgb(245, 158, 11)',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} validators`;
          }
        }
      }
    },
  };

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="h-full shadow-sm border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance Distribution</h3>
            <span className="text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
              </svg>
            </span>
          </div>
          <div className="h-[120px]">
            <Pie data={data} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
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
            View and manage your Validators
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
                value="25"
                subtitle="Across all operators"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>}
              />
              <MetricCard
                title="Total ETH Staked"
                value="806.25"
                subtitle="32 ETH per validator"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>}
              />
              <KeyCompositionCard />
              <BalanceDistributionCard />
            </div>
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
                        <th className="w-[15%] px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">ID</th>
                        <th className="w-[20%] px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                        <th className="w-[15%] px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Balance</th>
                        <th className="w-[15%] px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="w-[20%] px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Withdrawal Type</th>
                        <th className="w-[15%] px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array.from({ length: 25 }).map((_, i) => (
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
                              <div className="animate-pulse w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="animate-pulse w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="animate-pulse w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        validatorData.map((validator) => (
                          <tr key={validator.id} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{validator.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{validator.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{validator.balance} ETH</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                {validator.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                validator.withdrawalType === '0x01' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              }`}>
                                {validator.withdrawalType}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {validator.withdrawalType === '0x01' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50/50"
                                  onClick={() => {
                                    console.log(`Change validator ${validator.id} to type 0x02`);
                                  }}
                                >
                                  Change to 0x02
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50/50"
                                  onClick={() => {
                                    console.log(`Top up validator ${validator.id}`);
                                  }}
                                >
                                  Top Up
                                </Button>
                              )}
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
