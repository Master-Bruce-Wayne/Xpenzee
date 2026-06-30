import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D7263D", "#8E44AD"];

const ExpensePieChart = ({ data }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Expense Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={50}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
