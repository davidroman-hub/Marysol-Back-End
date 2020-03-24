const express = require('express');
const router = express.Router();

const {adminMiddleware, requireSignin} = require('../controllers/auth')

const { create, productById, read ,remove } = require('../controllers/product')


router.get('/product/:productId', read)
router.post('/product/create/:Id', requireSignin, adminMiddleware, create)
router.delete('/product/:productId/:Id', requireSignin, adminMiddleware, remove)
//router.delete('product/:productId/:Id', requireSignin, adminMiddleware,remove)

router.param("productId", productById)
module.exports = router