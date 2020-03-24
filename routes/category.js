const express = require('express')
const router = express.Router()

// to the admin can only create category
        //isadmin           //isauth
const {adminMiddleware,requireSignin } = require('../controllers/auth') 

const {categoryById,read,create,update,remove,list} = require('../controllers/category')

 router.post('/category/create/:Id',requireSignin,adminMiddleware,create)
 router.get('/category/:categoryId', read)
 router.put('/category/:categoryId/:Id',requireSignin,adminMiddleware,update)
 router.delete('/category/:categoryId/:Id', requireSignin,adminMiddleware,remove)
 router.get('/categories',list)


 router.param("categoryId",categoryById)
 module.exports = router