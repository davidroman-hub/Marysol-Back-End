const express = require('express');
const router = express.Router();

const {adminMiddleware, requireSignin} = require('../controllers/auth')

const { create } = require('../controllers/product')

router.post('/product/create/:Id', requireSignin, adminMiddleware, create)


module.exports = router