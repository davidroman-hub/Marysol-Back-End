const express = require('express')
const router = express.Router()

// to the admin can only create category
        //isadmin           //isauth
const {adminMiddleware,requireSignin } = require('../controllers/auth') 

const {categoryById,read,create} = require('../controllers/category')

 router.post('/category/create/:Id',requireSignin,adminMiddleware,create)
 router.get('/category/:categoryId', read)


 router.param("categoryId",categoryById)
 module.exports = router