const express = require('express')
const router = express.Router()

// import controller


const{ read, update,purchaseHistory } = require('../controllers/user')
const { userById ,requireSignin, adminMiddleware} = require('../controllers/auth')


//routes

router.get('/user/:id', requireSignin , read)
//router.get('/admin/:id', requireSignin , adminMiddleware,read)
router.put('/user/update', requireSignin ,  update)
router.put('/admin/update', requireSignin , adminMiddleware, update)
router.get('/orders/by/user/:id', requireSignin, purchaseHistory)
//router.param('userId', userById)


module.exports = router // {}