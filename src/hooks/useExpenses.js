import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.js";

/**
 * Fetches the current user's expenses from Firestore and derives
 * per-category aggregated totals for charts.
 *
 * Returns:
 *   expenses  – raw expense docs (with .id), ordered by date desc
 *   chartData – [{ category, amount }] aggregated for PieChart/LineChart
 *   loading   – true while fetching
 *   error     – error message string or null
 *   refresh   – call this to manually re-fetch (e.g. after a delete)
 */
export function useExpenses() {
  const { user } = useSelector((state) => state.user);
  const uid = user?.uid;

  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0); // increment to trigger a re-fetch

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchExpenses() {
      setLoading(true);
      setError(null);
      try {
        const expensesRef = collection(db, "users", uid, "expenses");
        const q = query(expensesRef, orderBy("date", "desc"));
        const snapshot = await getDocs(q);

        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Normalise date: Firestore Timestamp → JS Date → ISO string
            date:
              data.date?.toDate?.()
                ? data.date.toDate().toISOString()
                : data.date,
          };
        });

        if (cancelled) return;
        setExpenses(docs);

        // Aggregate per-category totals (fixed reduce logic)
        const aggregated = docs.reduce((acc, expense) => {
          const { category, amount } = expense;
          const existing = acc.find((e) => e.category === category);
          if (existing) {
            existing.amount += Number(amount);
          } else {
            acc.push({ category, amount: Number(amount) });
          }
          return acc;
        }, []);

        setChartData(aggregated);
      } catch (err) {
        if (!cancelled) setError("Failed to load expenses. Please try again.");
        console.error("useExpenses fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchExpenses();

    return () => {
      cancelled = true;
    };
  }, [uid, tick]);

  return { expenses, chartData, loading, error, refresh };
}
