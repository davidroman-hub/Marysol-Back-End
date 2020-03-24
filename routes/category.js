const express = require('express')
const router = express.Router()

// to the admin can only create category

const {adminMiddleware,requireSignin,isAuth } = require('../controllers/auth') 
const {read} = require('../controllers/user')


const {create} = require('../controllers/category')

 router.post('/category/create/:Id',requireSignin,adminMiddleware,create)


 module.exports = router