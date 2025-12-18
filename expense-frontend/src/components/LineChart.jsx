import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ExpenseLineChart = ({ data }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Expense Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
          <XAxis dataKey="category" className="text-gray-700 font-medium" />
          <YAxis className="text-gray-700 font-medium" />
          <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }} />
          <Legend className="text-gray-700 font-medium" />
          <Line type="monotone" dataKey="amount" stroke="#6366F1" strokeWidth={3} dot={{ stroke: "#6366F1", strokeWidth: 2, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseLineChart;
