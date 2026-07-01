import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Reads expenses from Redux state and computes category aggregates for charts.
 */
export function useExpensesAsCharts() {
  const { expenses, loading, error } = useSelector((store) => store.expenses);

  const chartData = useMemo(() => {
    if (!expenses) return [];

    return expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      const existing = acc.find((e) => e.category === category);
      if (existing) {
        existing.amount += Number(amount);
      } else {
        acc.push({ category, amount: Number(amount) });
      }
      return acc;
    }, []);
  }, [expenses]);

  console.log("Expense data is converted into charts data");

  return { chartData, loading, error };
}

export default useExpensesAsCharts;
