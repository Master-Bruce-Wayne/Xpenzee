import { useSelector } from "react-redux";
import { doc, deleteDoc, updateDoc, increment, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";
import { toast } from "react-toastify";
import ExpenseTable from "../components/ExpenseTable";
import { useExpenses } from "../hooks/useExpenses";

const Expenses = () => {
  const { user } = useSelector((state) => state.user);
  const uid = user?.uid;
  const { expenses, loading, error, refresh } = useExpenses();

  // ── Delete an expense ───────────────────────────────────────────────────────
  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete "${expense.category}" expense of ₹${expense.amount}?`)) return;
    try {
      // 1. Delete the expense document
      await deleteDoc(doc(db, "users", uid, "expenses", expense.id));

      // 2. Find the matching category and decrement totalSpent
      const categoriesRef = collection(db, "users", uid, "categories");
      const q = query(categoriesRef, where("name", "==", expense.category));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, {
          totalSpent: increment(-Number(expense.amount)),
        });
      }

      toast.success("Expense deleted.");
      refresh(); // re-fetch the list
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete expense.");
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-gray-400 tracking-widest uppercase">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Expenses</h1>
          <p className="text-gray-400 text-sm mt-1">
            {expenses.length} {expenses.length === 1 ? "entry" : "entries"} found
          </p>
        </div>
        <a
          href="/expense/add"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition"
        >
          + Add New
        </a>
      </div>

      {/* Empty state */}
      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-3 text-center">
          <p className="text-gray-400 text-lg">No expenses yet.</p>
          <a
            href="/expense/add"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
          >
            Add your first expense →
          </a>
        </div>
      ) : (
        <ExpenseTable data={expenses} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Expenses;