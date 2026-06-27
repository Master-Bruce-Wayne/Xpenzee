import React from "react";
import { FiTrash2 } from "react-icons/fi";

// Safely converts a Firestore Timestamp, JS Date, or ISO string → human-readable date
function formatDate(date) {
  if (!date) return "—";
  // Firestore Timestamp has a .toDate() method
  const d = typeof date?.toDate === "function" ? date.toDate() : new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ExpenseTable = ({ data, onDelete }) => {
  const total = data.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="bg-gray-900 border border-gray-800 shadow-lg rounded-xl overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              {onDelete && <th className="px-4 py-3 text-center">Delete</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.map((expense, index) => (
              <tr
                key={expense.id}
                className="text-sm text-gray-300 hover:bg-gray-800/50 transition"
              >
                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-white">{expense.category}</td>
                <td className="px-4 py-3 text-gray-400">{expense.description || "—"}</td>
                <td className="px-4 py-3">{formatDate(expense.date)}</td>
                <td className="px-4 py-3 font-semibold text-indigo-400">
                  ₹{Number(expense.amount).toLocaleString("en-IN")}
                </td>
                {onDelete && (
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onDelete(expense)}
                      className="text-red-400 hover:text-red-300 transition p-1 rounded hover:bg-red-400/10"
                      title="Delete expense"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-800/60 text-sm font-semibold text-white">
              <td colSpan={onDelete ? 4 : 4} className="px-4 py-3 text-right text-gray-400">
                Total
              </td>
              <td className="px-4 py-3 text-indigo-300 font-bold">
                ₹{total.toLocaleString("en-IN")}
              </td>
              {onDelete && <td />}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;

