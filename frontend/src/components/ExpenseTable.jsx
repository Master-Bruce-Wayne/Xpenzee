import React from 'react';

const ExpenseTable = (props) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full mx-auto mt-6">
    
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-2">
            <th className="px-2 py-2 text-left text-sm font-medium text-gray-600 border-2">S No.</th>
            <th className="px-2 py-2 text-left text-sm font-medium text-gray-600 border-2">Category</th>
            <th className="px-2 py-2 text-left text-sm font-medium text-gray-600 border-2">Description</th>
            <th className="px-2 py-2 text-left text-sm font-medium text-gray-600 border-2">Date</th>
            <th className="px-2 py-2 text-left text-sm font-medium text-gray-600 v">Amount</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((expense, index) => {
            return (
              <tr className="border-2">
                <td className="px-2 py-2 text-sm text-gray-700 border-2">{index + 1}</td>
                <td className="px-2 py-2 text-sm text-gray-700 border-2">{expense.category}</td>
                <td className="px-2 py-2 text-sm text-gray-700 border-2">{expense.description}</td>
                <td className="px-2 py-2 text-sm text-gray-700 border-2">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="px-2 py-2 text-sm text-gray-700 border-2">INR {expense.amount}</td>
              </tr>
            );
          })}
          <tr className="bg-gray-100 font-semibold text-black">
            <td colSpan={4} className="px-2 py-2 text-right">Total Expenses:</td>
            <td className="px-4 py-2">INR {props.data.reduce((acc, expense) => acc += expense.amount, 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
