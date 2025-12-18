const Expense = require('../models/expense');
const jwt = require('jsonwebtoken')

async function handleGetAllExpenses(req,res){
    // console.log("Cookies: ", req.cookies)
    const token = req.cookies?.userToken;

    const userId = jwt.verify(token, 'password')
    const expenses = await Expense.find({userId: userId.id});
    // console.log("Expenses: ", expenses)
    return res.status(200).json(expenses);
}

async function handleNewExpense(req,res){
    const { category, description, date,amount} = req.body;
    // console.log("Request body: ",req.body)

    if(req.cookies){
        const token = jwt.verify(req.cookies.userToken, "password")
        // console.log("Token: ",token)
        const userId = token.id;

        const expense = await Expense.create({
            userId, amount, category, description, date
        });

        return res.status(200).json(expense);
        // return res.json({message: 'Expense created'})
    }else{
        return res.status(400).json({message: "Cookie generate karle bhai"})
    }
}

async function handleDisplayExpense(req,res){
    const expenseId = req.params.id;
    const expense = await Expense.findOne({_id: expenseId});

    // console.log("Expesne is: ",expense);
    return res.status(200).json(expense);
}

async function handleUpdateExpense(req,res){
    const {amount, category, description, date} = req.body;

    const expense = await Expense.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body
    );

    if(!expense) return res.status(404).json({ message: 'Expense not found' });

    return res.json(expense);
}

async function handleDeleteExpense(req,res){
    await Expense.findOneAndDelete({ _id: req.params.id});
    return res.json({ message: 'Expense deleted' });
}

module.exports = {
    handleGetAllExpenses,
    handleNewExpense,
    handleDisplayExpense,
    handleUpdateExpense,
    handleDeleteExpense
}