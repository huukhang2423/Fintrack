import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { dashboardService } from '../../services/dashboardService';
import { DashboardSummary, ChartDataItem, Transaction, TrendDataItem } from '../../types';
import Card from '../../components/ui/Card';
import ExpenseChart from './ExpenseChart';
import IncomeChart from './IncomeChart';
import TrendChart from './TrendChart';
import ComparisonChart from './ComparisonChart';

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [expenseChartData, setExpenseChartData] = useState<ChartDataItem[]>([]);
  const [incomeChartData, setIncomeChartData] = useState<ChartDataItem[]>([]);
  const [trendData, setTrendData] = useState<TrendDataItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [summaryData, expenseData, incomeData, trend, transactions] = await Promise.all([
        dashboardService.getSummary(month, year),
        dashboardService.getChartData('EXPENSE', month, year),
        dashboardService.getChartData('INCOME', month, year),
        dashboardService.getMonthlyTrend(6),
        dashboardService.getRecentTransactions(5),
      ]);

      setSummary(summaryData);
      setExpenseChartData(expenseData);
      setIncomeChartData(incomeData);
      setTrendData(trend);
      setRecentTransactions(transactions);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with decorative background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-2xl p-8 shadow-lg">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-primary-100">Welcome back! Here's your financial overview</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-xl shadow-lg p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">This Month</span>
            </div>
            <p className="text-sm font-medium text-green-100 mb-1">Total Income</p>
            <p className="text-3xl font-bold">
              {formatCurrency(summary?.income || 0)}
            </p>
          </div>
        </div>

        {/* Expense Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 rounded-xl shadow-lg p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">This Month</span>
            </div>
            <p className="text-sm font-medium text-red-100 mb-1">Total Expense</p>
            <p className="text-3xl font-bold">
              {formatCurrency(summary?.expense || 0)}
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Current</span>
            </div>
            <p className="text-sm font-medium text-blue-100 mb-1">Balance</p>
            <p className="text-3xl font-bold">
              {formatCurrency(summary?.balance || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <Card title="6-Month Trend">
        {trendData.length > 0 ? (
          <TrendChart data={trendData} />
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No trend data available
          </p>
        )}
      </Card>

      {/* Income vs Expense Comparison */}
      <Card title="Income vs Expense Comparison">
        {trendData.length > 0 ? (
          <ComparisonChart data={trendData} />
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No comparison data available
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Chart */}
        <Card title="Expense Breakdown">
          {expenseChartData.length > 0 ? (
            <ExpenseChart data={expenseChartData} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No expense data for this month
            </p>
          )}
        </Card>

        {/* Income Chart */}
        <Card title="Income Breakdown">
          {incomeChartData.length > 0 ? (
            <IncomeChart data={incomeChartData} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No income data for this month
            </p>
          )}
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: transaction.category.color + '20' }}
                  >
                    {transaction.category.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {transaction.category.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${
                    transaction.type === 'INCOME'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  {formatCurrency(Number(transaction.amount))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No recent transactions
          </p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
