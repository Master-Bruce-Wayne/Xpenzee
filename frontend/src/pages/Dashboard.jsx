import { useSelector } from "react-redux";
import ExpensePieChart from "../components/PieChart";
import ExpenseLineChart from "../components/LineChart";
import { useExpenses } from "../hooks/useExpenses";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const { chartData, loading, error } = useExpenses();

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