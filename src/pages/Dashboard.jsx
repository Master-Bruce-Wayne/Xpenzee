import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ExpensePieChart from "../components/PieChart";
import ExpenseLineChart from "../components/LineChart";
import useFetchExpenses from "../hooks/useFetchExpenses";
import useExpensesAsCharts from "../hooks/useExpensesAsCharts";
import { generateMonthlySummaryWithAI } from "../utils/gemini";
import { FiZap } from "react-icons/fi";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const uid = user?.uid;
  useFetchExpenses();
  const { chartData, loading, error } = useExpensesAsCharts();

  // Load raw expenses for detailed AI insights calculation
  const { expenses } = useSelector((state) => state.expenses);

  const [aiSummary, setAiSummary] = useState("");
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState("");

  // Spending aggregates calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Filters for current and last month
  const thisMonthExpenses = (expenses || []).filter((exp) => {
    const d = new Date(exp.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const lastMonthExpenses = (expenses || []).filter((exp) => {
    const d = new Date(exp.date);
    const targetMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getFullYear() === targetYear && d.getMonth() === targetMonth;
  });

  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Month-over-Month change calculation
  let momChangeText = "";
  if (lastMonthTotal === 0) {
    momChangeText = thisMonthTotal > 0 ? "First month of transactions" : "No expenses in either month";
  } else {
    const pct = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    momChangeText = `${Math.abs(pct).toFixed(0)}% ${pct >= 0 ? "more" : "less"}`;
  }

  // Category aggregate mapping
  const categorySpend = thisMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  useEffect(() => {
    if (!uid || expenses.length === 0) return;

    // Cache key based on user ID, current month transaction count, and current month total
    const cacheKey = `summary_${uid}_${thisMonthExpenses.length}_${thisMonthTotal}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      setAiSummary(cached);
      return;
    }

    async function fetchSummary() {
      setAiSummaryLoading(true);
      setAiSummaryError("");
      try {
        const summary = await generateMonthlySummaryWithAI({
          thisMonthTotal,
          lastMonthTotal,
          momChangeText,
          categorySpend,
          transactions: thisMonthExpenses,
        });
        setAiSummary(summary);
        sessionStorage.setItem(cacheKey, summary);
      } catch (err) {
        console.error("AI Summary error:", err);
        setAiSummaryError("Could not load spending insights. Please check your API key configuration.");
      } finally {
        setAiSummaryLoading(false);
      }
    }

    fetchSummary();
  }, [uid, expenses.length, thisMonthTotal]);


  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-gray-400 tracking-widest uppercase">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Welcome back,{" "}
          <span className="text-indigo-400">
            {user?.fullName ?? "there"}
          </span>{" "}
          👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Here's a summary of your spending.
        </p>
      </div>

      {/* AI Spending Insights Card */}
      {expenses.length > 0 && (
        <div className="mb-8 p-5 bg-gradient-to-r from-indigo-950/30 to-slate-900/30 border border-indigo-500/10 rounded-2xl shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FiZap className="text-indigo-400 text-7xl animate-pulse" />
          </div>

          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FiZap className="text-yellow-400 animate-bounce" /> AI Spending Insights
            </h3>

            {aiSummaryLoading ? (
              <div className="flex items-center gap-2 py-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                <p className="text-sm text-gray-400">Analyzing your spending behavior...</p>
              </div>
            ) : aiSummaryError ? (
              <p className="text-xs text-red-400/80">{aiSummaryError}</p>
            ) : (
              <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium">
                {aiSummary || "Add more expenses to see detailed monthly insights."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-3 text-center">
          <p className="text-gray-400 text-lg">No expenses recorded yet.</p>
          <a
            href="/expense/add"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
          >
            Add your first expense →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ExpensePieChart data={chartData} />
          <ExpenseLineChart data={chartData} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;