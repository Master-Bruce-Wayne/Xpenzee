const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId:{  type: mongoose.Schema.Types.ObjectId,  required: true },
    amount: {  type: Number,  required: true, },
    category: { type: String, required: true, },
    description: { type: String, },
    date: { type: Date, default: Date.now, },
});

const Expense = mongoose.model('expense',expenseSchema);

module.exports = Expense;