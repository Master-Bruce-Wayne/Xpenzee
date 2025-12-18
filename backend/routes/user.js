const { handleUserSignUp, handleUserLogin } = require("../controllers/user");
const express = require('express');

const router=express.Router();

router.post('/login',handleUserLogin);
router.post('/signup', handleUserSignUp);

module.exports = router