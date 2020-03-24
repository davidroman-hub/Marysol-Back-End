const express = require('express');
const router = express.Router();

const {adminMiddleware, requireSignin} = require('../controllers/auth')

const { create, productById, read } = require('../controllers/product')


router.get('/product/:productId', read)
router.post('/product/create/:Id', requireSignin, adminMiddleware, create)


router.param("productId", productById)
module.exports = router