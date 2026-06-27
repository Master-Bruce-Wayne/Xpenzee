import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiTrash2, FiPlus, FiTag, FiTrendingUp } from "react-icons/fi";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js";

// Progress bar — shows totalSpent vs monthlyBudget
function BudgetBar({ spent, budget }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const color =
    pct >= 90 ? "bg-red-500" : pct >= 60 ? "bg-yellow-500" : "bg-emerald-500";

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>₹{Number(spent).toLocaleString("en-IN")} spent</span>
        <span>{pct.toFixed(0)}% of ₹{Number(budget).toLocaleString("en-IN")}</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const Categories = () => {
  const { user } = useSelector((state) => state.user);
  const uid = user?.uid;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false); // controls add-form visibility

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // ── Fetch categories ────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "users", uid, "categories"),
        orderBy("name", "asc")
      );
      const snap = await getDocs(q);
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Fetch categories error:", err);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ── Add category ────────────────────────────────────────────────────────────
  const onAddCategory = async (data) => {
    // Prevent duplicates (case-insensitive)
    const duplicate = categories.some(
      (c) => c.name.toLowerCase() === data.name.trim().toLowerCase()
    );
    if (duplicate) {
      toast.error(`Category "${data.name}" already exists.`);
      return;
    }

    try {
      await addDoc(collection(db, "users", uid, "categories"), {
        name: data.name.trim(),
        monthlyBudget: Number(data.monthlyBudget),
        totalSpent: 0,
      });
      toast.success(`Category "${data.name}" added!`);
      reset();
      setAdding(false);
      fetchCategories();
    } catch (err) {
      console.error("Add category error:", err);
      toast.error("Failed to add category.");
    }
  };

  // ── Delete category ─────────────────────────────────────────────────────────
  const handleDelete = async (cat) => {
    if (
      !window.confirm(
        `Delete category "${cat.name}"? This won't delete its expenses, but they'll have no matching category.`
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "users", uid, "categories", cat.id));
      toast.success(`"${cat.name}" deleted.`);
      fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
      toast.error("Failed to delete category.");
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
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

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your spending categories and monthly budgets
          </p>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition"
        >
          <FiPlus />
          {adding ? "Cancel" : "New Category"}
        </button>
      </div>

      {/* ── Add Category Form ─────────────────────────────────────────────── */}
      {adding && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiTag className="text-indigo-400" /> Add New Category
          </h2>
          <form
            onSubmit={handleSubmit(onAddCategory)}
            className="flex flex-col sm:flex-row gap-4"
            noValidate
          >
            {/* Category name */}
            <div className="flex-1">
              <input
                {...register("name", {
                  required: "Category name is required",
                  maxLength: { value: 30, message: "Max 30 characters" },
                })}
                type="text"
                placeholder="e.g. Food, Transport, Rent…"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Monthly budget */}
            <div className="w-full sm:w-44">
              <input
                {...register("monthlyBudget", {
                  required: "Budget is required",
                  min: { value: 1, message: "Must be > 0" },
                })}
                type="number"
                placeholder="Monthly budget (₹)"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.monthlyBudget && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.monthlyBudget.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition whitespace-nowrap"
            >
              {isSubmitting ? "Saving…" : "Add Category"}
            </button>
          </form>
        </div>
      )}

      {/* ── Category Cards ────────────────────────────────────────────────── */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-2">
            <FiTag className="text-indigo-400 text-3xl" />
          </div>
          <p className="text-gray-300 text-lg font-medium">No categories yet</p>
          <p className="text-gray-500 text-sm max-w-xs">
            Create a category like "Food" or "Transport" and set a monthly
            budget — then you can start adding expenses.
          </p>
          <button
            onClick={() => setAdding(true)}
            className="mt-3 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition"
          >
            Create your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition group"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <FiTrendingUp className="text-indigo-400 text-sm" />
                  </div>
                  <h3 className="text-white font-semibold text-base">
                    {cat.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleDelete(cat)}
                  className="text-gray-600 hover:text-red-400 transition p-1 rounded opacity-0 group-hover:opacity-100"
                  title="Delete category"
                >
                  <FiTrash2 />
                </button>
              </div>

              {/* Budget info */}
              <p className="text-xs text-gray-500 ml-10 mb-2">
                Monthly budget: ₹{Number(cat.monthlyBudget).toLocaleString("en-IN")}
              </p>

              {/* Progress bar */}
              <BudgetBar
                spent={cat.totalSpent ?? 0}
                budget={cat.monthlyBudget}
              />

              {/* Remaining */}
              <p className="text-xs text-gray-500 mt-2 text-right">
                {cat.monthlyBudget - (cat.totalSpent ?? 0) >= 0
                  ? `₹${(cat.monthlyBudget - (cat.totalSpent ?? 0)).toLocaleString("en-IN")} remaining`
                  : `₹${Math.abs(cat.monthlyBudget - (cat.totalSpent ?? 0)).toLocaleString("en-IN")} over budget`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
