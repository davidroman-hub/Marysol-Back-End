const express = require('express');
const router = express.Router();

const {adminMiddleware, requireSignin} = require('../controllers/auth')

const { create,
         productById, 
         read ,
         remove ,
         update, 
         list, 
         listRelated, 
         listCategories,
         listBySearch,
         photo,
        listSearch
        } = require('../controllers/product')


router.get('/product/:productId', read)
router.post('/product/create/:Id', requireSignin, adminMiddleware, create)
router.delete('/product/:productId/:Id', requireSignin, adminMiddleware, remove)
router.put('/product/:productId/:Id', requireSignin, adminMiddleware, update)
router.get('/products', list)
router.get('/products/related/:productId', listRelated)
router.get('/products/categories', listCategories)
router.post('/products/by/search', listBySearch)
router.get('/product/photo/:productId', photo)
router.get('/product/search', listSearch)



router.param("productId", productById)
module.exports = router