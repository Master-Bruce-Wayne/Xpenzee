const express = require('express');
const { handleGetAllExpenses, handleDisplayExpense, handleUpdateExpense,handleNewExpense,handleDeleteExpense } = require('../controllers/expense');

const router = express.Router();

router.route('/').get(handleGetAllExpenses);
router.post('/add', handleNewExpense);
   
router.route('/:id')
    .get(handleDisplayExpense)
    .put(handleUpdateExpense)
    .delete(handleDeleteExpense);

module.exports =router;