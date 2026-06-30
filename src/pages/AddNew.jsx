import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";
import useFetchCategories from "../hooks/useFetchCategories.js";
import { updateCategorySpent } from "../redux/categoriesSlice.js";

const AddNew = () => {
  const { user } = useSelector((state) => state.user);
  const uid = user?.uid;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // ── Load categories from Redux ──────────────────────────────────────────────
  useFetchCategories();
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function onSubmit(data) {
    try {
      const amount = Number(data.amount);

      // Convert the date string from <input type="date"> to a Firestore Timestamp
      const dateParts = data.date.split("-"); // "2024-06-27"
      const jsDate = new Date(
        Number(dateParts[0]),
        Number(dateParts[1]) - 1,
        Number(dateParts[2])
      );

      // 1. Write the expense document
      await addDoc(collection(db, "users", uid, "expenses"), {
        category: data.category,
        description: data.description || "",
        amount,
        date: Timestamp.fromDate(jsDate),
        createdAt: serverTimestamp(),
      });

      // 2. Find the matching category and increment totalSpent in Firestore
      const categoriesRef = collection(db, "users", uid, "categories");
      const q = query(categoriesRef, where("name", "==", data.category));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, {
          totalSpent: increment(amount),
        });
      }

      // 3. Update the category's total spent in the Redux store
      dispatch(updateCategorySpent({ categoryName: data.category, amount }));

      toast.success("Expense added!");
      navigate("/expense");
    } catch (err) {
      console.error("AddNew error:", err);
      toast.error("Failed to add expense. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
      <div className="bg-gray-900 border border-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-1 text-center">Add New Expense</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Record a new spending entry
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">

          {/* Category — dropdown from Firestore */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            {categoriesLoading ? (
              <div className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 text-sm">
                Loading categories…
              </div>
            ) : (
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="">-- Select a category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
            {errors.category && (
              <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <input
              {...register("description")}
              type="text"
              placeholder="e.g. Lunch at café"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              {...register("date", { required: "Date is required" })}
              type="date"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition [color-scheme:dark]"
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount (₹)
            </label>
            <input
              {...register("amount", {
                required: "Amount is required",
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              type="number"
              placeholder="0"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || categoriesLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm mt-2"
          >
            {isSubmitting ? "Saving…" : "Add Expense"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          View all expenses?{" "}
          <Link to="/expense" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
            Go to History
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AddNew;

