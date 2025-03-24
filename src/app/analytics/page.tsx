"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut, PolarArea } from "react-chartjs-2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
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

// Dummy network statistics
const networkStats = {
  totalValidators: 858246,
  totalStaked: 27463888,
  networkParticipation: 15.32, // %
  averageAPY: 3.42, // %
  averageEigenAPY: 4.68, // %
};

// EigenLayer vs. Standard distribution for filled bars
const validatorDistribution = {
  standard: 459832,
  eigenLayer: 398414,
  maxValidators: 1000000, // For visualization purposes
};

// Generate monthly staking data
const generateMonthlyStakingData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Last 12 months
  const labels = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i) % 12;
    labels.push(months[monthIndex < 0 ? monthIndex + 12 : monthIndex]);
  }
  
  // Generate data with upward trend
  const baseData = [230000, 240000, 255000, 275000, 300000, 325000, 355000, 390000, 430000, 480000, 530000, 580000];
  const eigenLayerData = [50000, 75000, 100000, 125000, 150000, 180000, 220000, 270000, 330000, 400000, 450000, 500000];

  return {
    labels,
    datasets: [
      {
        label: 'Total ETH Staked',
        data: baseData.map(val => val * 32 / 1000000), // Convert to millions of ETH
        borderColor: '#0070F3',
        backgroundColor: 'rgba(0, 112, 243, 0.1)',
        fill: true,
        tension: 0.4,
        order: 1,
      },
      {
        label: 'EigenLayer Restaked ETH',
        data: eigenLayerData.map(val => val * 32 / 1000000), // Convert to millions of ETH
        borderColor: '#5BC470',
        backgroundColor: 'rgba(91, 196, 112, 0.1)',
        fill: true,
        tension: 0.4,
        order: 2,
      }
    ]
  };
};

const generateAvgRewardsData = () => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    labels,
    datasets: [
      {
        label: 'Ethereum Staking APY',
        data: [3.3, 3.1, 3.3, 3.4, 3.5, 3.3, 3.4, 3.5, 3.4, 3.2, 3.3, 3.4],
        backgroundColor: '#0070F3',
        borderRadius: 4,
        categoryPercentage: 0.4,
        barPercentage: 0.8,
      },
      {
        label: 'EigenLayer APY Boost',
        data: [1.2, 1.1, 1.3, 1.2, 1.4, 1.2, 1.3, 1.3, 1.2, 1.3, 1.4, 1.3],
        backgroundColor: '#5BC470',
        borderRadius: 4,
        categoryPercentage: 0.4,
        barPercentage: 0.8,
      }
    ]
  };
};

const generateDistributionData = () => {
  return {
    labels: ['Solo Stakers', 'Liquid Staking', 'Exchanges', 'EigenLayer Restaking'],
    datasets: [
      {
        data: [22, 34, 18, 26],
        backgroundColor: [
          '#001F3F',  // Navy Blue
          '#0070F3',  // Bright Blue
          '#30B4FF',  // Light Blue
          '#5BC470',  // Vibrant Green
        ],
        borderWidth: 0,
      }
    ]
  };
};

const generateOperatorsData = () => {
  return {
    labels: ['Bitwise', 'EigenLabs', 'P2P', 'Figment', 'Blockdaemon', 'Other'],
    datasets: [
      {
        data: [32, 26, 18, 12, 8, 4],
        backgroundColor: [
          '#001F3F',  // Navy Blue
          '#0070F3',  // Bright Blue
          '#30B4FF',  // Light Blue
          '#5BC470',  // Vibrant Green
          '#9333EA',  // Purple
          '#F59E0B',  // Orange
        ],
      }
    ]
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

const doughnutOptions: ChartOptions<'doughnut'> = {
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
};

// Performance metrics data
const performanceMetrics = [
  { title: "Total Rewards to Date", value: "4.82 ETH", subtitle: "Across all validators", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
    </svg> },
  { title: "Annualized Yield", value: "4.8%", subtitle: "Base ETH staking rate", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
    </svg> },
  { title: "EigenLayer Bonus", value: "+1.5%", subtitle: "Additional yield from restaking", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg> },
  { title: "Effective APR", value: "6.3%", subtitle: "Combined total yield", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z" />
    </svg> },
];

// Historical data table
const historicalData = [
  { date: '2023-12-01', rewards: '0.164 ETH', apr: '4.6%', eigenlayer: '0.052 ETH', mev: '0.012 ETH' },
  { date: '2023-11-01', rewards: '0.158 ETH', apr: '4.5%', eigenlayer: '0.048 ETH', mev: '0.014 ETH' },
  { date: '2023-10-01', rewards: '0.162 ETH', apr: '4.7%', eigenlayer: '0.050 ETH', mev: '0.010 ETH' },
  { date: '2023-09-01', rewards: '0.156 ETH', apr: '4.4%', eigenlayer: '0.045 ETH', mev: '0.009 ETH' },
  { date: '2023-08-01', rewards: '0.159 ETH', apr: '4.5%', eigenlayer: '0.047 ETH', mev: '0.011 ETH' },
];

// Metric Card Component
function MetricCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="h-full shadow-sm border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <span className="text-vibrant-green">{icon}</span>
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

export default function AnalyticsPage() {
  const [activeView, setActiveView] = useState("overview");
  const [monthlyData, setMonthlyData] = useState(generateMonthlyStakingData());
  const [rewardsData, setRewardsData] = useState(generateAvgRewardsData());
  const [distributionData, setDistributionData] = useState(generateDistributionData());
  const [operatorsData, setOperatorsData] = useState(generateOperatorsData());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Geist, sans-serif',
            size: 12
          },
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 31, 63, 0.8)',
        padding: 12,
        cornerRadius: 10,
        titleFont: {
          family: 'Geist, sans-serif',
          size: 13,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: 'Geist, sans-serif',
          size: 12
        },
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ' + context.raw + ' million ETH';
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Geist, sans-serif',
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: 'Geist, sans-serif',
            size: 10
          },
          callback: function(value: any) {
            return value + 'M';
          }
        }
      }
    }
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Geist, sans-serif',
            size: 12
          },
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 31, 63, 0.8)',
        padding: 12,
        cornerRadius: 10,
        titleFont: {
          family: 'Geist, sans-serif',
          size: 13,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: 'Geist, sans-serif',
          size: 12
        },
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ' + context.raw + '%';
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        stacked: true,
        ticks: {
          font: {
            family: 'Geist, sans-serif',
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        stacked: true,
        ticks: {
          font: {
            family: 'Geist, sans-serif',
            size: 10
          },
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: 'Geist, sans-serif',
            size: 12
          },
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 31, 63, 0.8)',
        padding: 12,
        cornerRadius: 10,
        titleFont: {
          family: 'Geist, sans-serif',
          size: 13,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: 'Geist, sans-serif',
          size: 12
        },
        callbacks: {
          label: function(context: any) {
            return context.label + ': ' + context.raw + '%';
          }
        }
      }
    },
  };
  
  const polarOptions = {
    ...doughnutOptions,
    plugins: {
      ...doughnutOptions.plugins,
      legend: {
        ...doughnutOptions.plugins.legend,
        position: 'right' as const,
      }
    },
    scales: {
      r: {
        ticks: {
          display: false
        }
      }
    }
  };
  
  const StatCard = ({ title, value, suffix, description, icon, color }: any) => (
    <div className="w-full">
      <Card className="h-full card-hover">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold">{value}</p>
                <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">{suffix}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Loading skeleton component
  const ChartSkeleton = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-t-2 border-b-2 border-bright-blue animate-spin"></div>
    </div>
  );
  
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
          <h1 className="text-3xl font-bold text-[#1a2e22]">Analytics</h1>
          <p className="text-gray-700 mt-2">
            In-depth analytics and insights for your staking portfolio
          </p>
        </motion.div>

        <Tabs
          defaultValue={activeView}
          onValueChange={setActiveView}
          className="w-full"
        >
          <TabsList className="mb-6 bg-white dark:bg-navy-blue-800 border border-gray-100 dark:border-gray-700 p-1 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Rewards Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="validators" 
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Validators
            </TabsTrigger>
            <TabsTrigger 
              value="network" 
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Network Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Performance Metrics */}
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {performanceMetrics.map((metric, index) => (
                    <MetricCard
                      key={index}
                      title={metric.title}
                      value={metric.value}
                      subtitle={metric.subtitle}
                      icon={metric.icon}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div variants={itemVariants}>
                  <Card className="shadow-sm border border-gray-100 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>APR Comparison</CardTitle>
                      <CardDescription>Base ETH staking vs. with EigenLayer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-green"></div>
                          </div>
                        ) : (
                          <Line data={rewardsData} options={lineChartOptions} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="shadow-sm border border-gray-100 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>Rewards Distribution</CardTitle>
                      <CardDescription>Breakdown of reward sources</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-green"></div>
                          </div>
                        ) : (
                          <Doughnut data={distributionData} options={doughnutOptions} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Daily Rewards Chart */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
                  <CardHeader>
                    <CardTitle>Daily Rewards (Last 30 Days)</CardTitle>
                    <CardDescription>ETH rewards earned per day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-green"></div>
                        </div>
                      ) : (
                        <Bar data={monthlyData} options={lineOptions} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="rewards">
            <Card className="shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Rewards Analysis</CardTitle>
                <CardDescription>Detailed breakdown of all rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-8">This tab will contain detailed rewards analysis.</p>
                <div className="flex justify-center">
                  <Button variant="outline">Export Rewards Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="validators">
            <Card className="shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Validator Performance</CardTitle>
                <CardDescription>Performance metrics for each validator</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-8">This tab will contain detailed validator performance metrics.</p>
                <div className="flex justify-center">
                  <Button variant="outline">View Performance Reports</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="network">
            <Card className="shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Network Stats</CardTitle>
                <CardDescription>Detailed network statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Stat</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(networkStats).map(([stat, value]) => (
                        <tr key={stat} className="border-b border-gray-200 dark:border-gray-800">
                          <td className="px-4 py-3 text-sm">{stat.charAt(0).toUpperCase() + stat.slice(1)}</td>
                          <td className="px-4 py-3 text-sm">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center mt-8">
                  <Button variant="outline">Export All Network Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 