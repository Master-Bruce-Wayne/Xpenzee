const express = require('express');
const { handleGetAllExpenses } = require('../controllers/expense');

const router = express.Router();

router.get('/',handleGetAllExpenses)

module.exports = router;